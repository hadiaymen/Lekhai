from fastapi import APIRouter
from fastapi.responses import FileResponse
from database import SessionLocal, Transaction
from services.statement_service import generate_financial_statements
from services.pdf_service import generate_pdf
import os

router = APIRouter()

@router.get("/")
async def export_pdf():
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
        
        template_data = {
            "company_name": "ACME Corporation",
            "financial_year": "FY 2024-25",
            "month": "Current",
            "revenue": statements["profit_and_loss"]["revenue"],
            "expenses": statements["profit_and_loss"]["operating_expenses"],
            "net_profit": statements["profit_and_loss"]["net_profit"],
            "assets": statements["balance_sheet"]["assets"],
            "liabilities": statements["balance_sheet"]["liabilities"],
            "equity": statements["balance_sheet"]["equity"],
            "cogs": statements["profit_and_loss"]["cogs"],
            "gross_profit": statements["profit_and_loss"]["gross_profit"]
        }
        
        pdf_path = await generate_pdf(template_data)
        
        return FileResponse(pdf_path, media_type="application/pdf", filename="Financial_Statement.pdf")
    finally:
        db.close()
