import asyncio
from services.ocr_service import extract_financial_data
from services.classification_service import classify_transactions
from services.statement_service import generate_financial_statements
from services.pdf_service import generate_pdf

async def run_pipeline():
    print("1. Extracting data...")
    # Passing a dummy file path since mock is active
    extracted = extract_financial_data("dummy.pdf")
    print("Extracted:", extracted)
    
    print("\n2. Classifying transactions...")
    transactions = extracted.get("transactions", [])
    categorized = classify_transactions(transactions)
    print("Categorized:", categorized)
    
    print("\n3. Generating statements...")
    statements = generate_financial_statements(categorized)
    print("Statements:", statements)
    
    print("\n4. Generating PDF...")
    # Map backend data to Jinja template variables
    template_data = {
        "company_name": "AccuLedger Professional",
        "financial_year": "2024",
        "month": "June",
        "revenue": statements["profit_and_loss"]["revenue"],
        "expenses": statements["profit_and_loss"]["operating_expenses"],
        "net_profit": statements["profit_and_loss"]["net_profit"],
        "assets": statements["balance_sheet"]["assets"],
        "liabilities": statements["balance_sheet"]["liabilities"],
        "equity": statements["balance_sheet"]["equity"]
    }
    
    pdf_path = await generate_pdf(template_data)
    print(f"PDF generated successfully at: {pdf_path}")

if __name__ == "__main__":
    asyncio.run(run_pipeline())
