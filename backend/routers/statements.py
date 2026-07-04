from fastapi import APIRouter
from database import SessionLocal, Transaction
from services.statement_service import generate_financial_statements

router = APIRouter()

@router.get("/")
async def get_statements():
    db = SessionLocal()
    try:
        transactions_db = db.query(Transaction).all()
        all_txs = [
            {
                "date": t.date.strftime("%Y-%m-%d") if t.date else "",
                "description": t.description,
                "amount": t.amount,
                "type": t.type,
                "category": t.category
            } for t in transactions_db
        ]
        
        statements = generate_financial_statements(all_txs)
        
        return {
            "status": "success",
            "data": statements
        }
    finally:
        db.close()
