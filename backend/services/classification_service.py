import openai
import os
import json

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "mock_key")

if OPENAI_API_KEY != "mock_key":
    openai.api_key = OPENAI_API_KEY

def classify_transactions(transactions: list):
    if OPENAI_API_KEY == "mock_key":
        return _mock_classify(transactions)
    
    # Real OpenAI classification
    prompt = f"""
    Classify the following transactions into standard accounting categories (e.g., Cloud Expense, Revenue, Utility Expense, Professional Income).
    Return a JSON array of objects with the original description and the assigned category.
    Transactions: {transactions}
    """
    
    response = openai.chat.completions.create(
        model="gpt-4",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.0
    )
    
    try:
        content = response.choices[0].message.content
        # sometimes GPT wraps in ```json
        content = content.replace("```json", "").replace("```", "").strip()
        classifications = json.loads(content)
        
        # update transactions
        # classifications is expected to be [{"description": "...", "category": "..."}]
        cat_map = {c.get("description", ""): c.get("category", "Uncategorized") for c in classifications}
        
        for tx in transactions:
            desc = tx.get("description", "")
            tx["category"] = cat_map.get(desc, "Uncategorized")
            
        return transactions
    except Exception as e:
        print("Classification error:", e)
        return _mock_classify(transactions)

def _mock_classify(transactions: list):
    # Rule-based mock classification for demo
    categorized = []
    for tx in transactions:
        desc = tx["description"].lower()
        if "amazon" in desc or "software" in desc:
            cat = "Cloud & Software Expense"
        elif "payment" in desc:
            cat = "Revenue"
        else:
            cat = "Office Expense"
        tx["category"] = cat
        categorized.append(tx)
    return categorized
