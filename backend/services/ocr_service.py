from azure.ai.documentintelligence import DocumentIntelligenceClient
from azure.core.credentials import AzureKeyCredential
import os

ENDPOINT = os.getenv("AZURE_DOCUMENT_INTELLIGENCE_ENDPOINT", "mock_endpoint")
KEY = os.getenv("AZURE_DOCUMENT_INTELLIGENCE_KEY", "mock_key")

def extract_financial_data(file_path: str):
    # If no real keys are provided, return mock data extracted
    if KEY == "mock_key":
        return _mock_extract(file_path)
    
    # Real extraction
    document_intelligence_client = DocumentIntelligenceClient(
        endpoint=ENDPOINT, credential=AzureKeyCredential(KEY)
    )
    
    with open(file_path, "rb") as f:
        poller = document_intelligence_client.begin_analyze_document(
            "prebuilt-invoice", analyze_request=f, content_type="application/octet-stream"
        )
    result = poller.result()
    
    # Process result into structured data
    vendor = getattr(result.fields.get("VendorName"), "value", "Unknown Vendor") if result.fields.get("VendorName") else "Unknown Vendor"
    total = getattr(result.fields.get("InvoiceTotal"), "value", 0.0) if result.fields.get("InvoiceTotal") else 0.0
    date = getattr(result.fields.get("InvoiceDate"), "value", "2024-06-01") if result.fields.get("InvoiceDate") else "2024-06-01"
    
    transactions = []
    
    # Check for line items
    items = result.fields.get("Items")
    if items and hasattr(items, "value") and items.value:
        for item in items.value:
            if hasattr(item, "value"):
                desc = getattr(item.value.get("Description"), "value", "Unknown Item") if item.value.get("Description") else "Unknown Item"
                amount = getattr(item.value.get("Amount"), "value", 0.0) if item.value.get("Amount") else 0.0
                item_date = getattr(item.value.get("Date"), "value", date) if item.value.get("Date") else date
                
                if amount:
                    transactions.append({
                        "date": str(item_date),
                        "description": str(desc),
                        "amount": float(amount),
                        "type": "Debit"
                    })
    
    # If no items found, use the total as a single transaction
    if not transactions and total:
        transactions.append({
            "date": str(date),
            "description": f"Invoice from {vendor}",
            "amount": float(total),
            "type": "Debit"
        })

    extracted_data = {
        "vendor": str(vendor),
        "total": float(total),
        "date": str(date),
        "transactions": transactions
    }
    return extracted_data

def _mock_extract(file_path: str):
    # A sophisticated mock that returns structured data resembling OCR extraction
    return {
        "transactions": [
            {"date": "2024-06-01", "description": "Amazon Web Services", "amount": 120.50, "type": "Debit"},
            {"date": "2024-06-05", "description": "Client Payment - XYZ Corp", "amount": 5000.00, "type": "Credit"},
            {"date": "2024-06-12", "description": "Office Supplies", "amount": 45.00, "type": "Debit"},
            {"date": "2024-06-15", "description": "Software Subscription", "amount": 29.99, "type": "Debit"},
        ]
    }
