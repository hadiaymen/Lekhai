from fastapi import APIRouter, UploadFile, File, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
import uuid
import os
from datetime import datetime
from database import SessionLocal, Document, Transaction, Company
from services.ocr_service import extract_financial_data
from services.classification_service import classify_transactions

router = APIRouter()

def process_document(doc_id: str, file_path: str):
    db = SessionLocal()
    try:
        doc = db.query(Document).filter(Document.id == doc_id).first()
        if not doc:
            return
            
        doc.status = "extracting"
        db.commit()
        
        extracted_data = extract_financial_data(file_path)
        
        doc.status = "classifying"
        db.commit()
        
        transactions = extracted_data.get("transactions", [])
        categorized = classify_transactions(transactions)
        
        # Insert transactions
        for tx in categorized:
            tx_date_str = tx.get("date", "")
            tx_date = datetime.utcnow()
            if isinstance(tx_date_str, str) and tx_date_str:
                try:
                    # attempt to parse YYYY-MM-DD
                    tx_date = datetime.strptime(tx_date_str, "%Y-%m-%d")
                except ValueError:
                    pass
                    
            new_tx = Transaction(
                id=str(uuid.uuid4()),
                document_id=doc_id,
                company_id=doc.company_id,
                date=tx_date,
                description=tx.get("description", "Unknown"),
                amount=tx.get("amount", 0.0),
                type=tx.get("type", "Debit"),
                category=tx.get("category", "Uncategorized"),
                confidence_score=95.0,
                is_approved=True
            )
            db.add(new_tx)
            
        doc.status = "completed"
        db.commit()
    except Exception as e:
        db.rollback()
        doc = db.query(Document).filter(Document.id == doc_id).first()
        if doc:
            doc.status = f"error: {str(e)}"
            db.commit()
    finally:
        db.close()
        if os.path.exists(file_path):
            os.remove(file_path)

@router.post("/")
async def upload_document(background_tasks: BackgroundTasks, file: UploadFile = File(...)):
    if not file:
        raise HTTPException(status_code=400, detail="No file uploaded")
        
    db = SessionLocal()
    try:
        company = db.query(Company).first()
        if not company:
            company = Company(id="default-company", name="ACME Corporation", financial_year="FY 2024-25")
            db.add(company)
            db.commit()
            
        doc_id = str(uuid.uuid4())
        file_path = f"temp_{doc_id}_{file.filename}"
        
        with open(file_path, "wb") as f:
            f.write(await file.read())
            
        new_doc = Document(
            id=doc_id,
            company_id=company.id,
            filename=file.filename,
            doc_type="Unknown",
            status="queued"
        )
        db.add(new_doc)
        db.commit()
        
        background_tasks.add_task(process_document, doc_id, file_path)
        
        return {
            "document_id": doc_id,
            "filename": file.filename,
            "status": "processing"
        }
    finally:
        db.close()

@router.get("/{doc_id}")
async def get_document_status(doc_id: str):
    db = SessionLocal()
    try:
        doc = db.query(Document).filter(Document.id == doc_id).first()
        if not doc:
            return {"document_id": doc_id, "status": "not_found", "data": None}
            
        transactions = db.query(Transaction).filter(Transaction.document_id == doc_id).all()
        
        data = {
            "vendor": "Extracted Vendor",
            "total": sum([t.amount for t in transactions if t.type == "Debit"]),
            "date": doc.upload_date.isoformat(),
            "transactions": [
                {
                    "date": t.date.strftime("%Y-%m-%d") if t.date else "",
                    "description": t.description,
                    "amount": t.amount,
                    "type": t.type,
                    "category": t.category
                } for t in transactions
            ]
        } if doc.status == "completed" else None
        
        return {
            "document_id": doc_id,
            "status": doc.status,
            "data": data
        }
    finally:
        db.close()

# Mock endpoint to return all extracted data for the UI
@router.get("/all/data")
async def get_all_data():
    db = SessionLocal()
    try:
        transactions = db.query(Transaction).all()
        all_txs = [
            {
                "date": t.date.strftime("%Y-%m-%d") if t.date else "",
                "description": t.description,
                "amount": t.amount,
                "type": t.type,
                "category": t.category
            } for t in transactions
        ]
        return {"transactions": all_txs}
    finally:
        db.close()
