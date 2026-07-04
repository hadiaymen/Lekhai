import os
import jinja2
from playwright.async_api import async_playwright

TEMPLATE_PATH = os.path.join(os.path.dirname(__file__), "../templates")

async def generate_pdf(data: dict) -> str:
    # Set up Jinja2 environment
    env = jinja2.Environment(loader=jinja2.FileSystemLoader(TEMPLATE_PATH))
    template = env.get_template("financial_statement.html")
    
    # Render the HTML with actual data
    html_out = template.render(data)
    
    # Save temporarily
    temp_html_path = "temp_statement.html"
    with open(temp_html_path, "w", encoding="utf-8") as f:
        f.write(html_out)
        
    pdf_path = "export.pdf"
    
    # Use playwright to print to PDF
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        
        # Load the HTML string or local file
        file_uri = f"file:///{os.path.abspath(temp_html_path).replace(chr(92), '/')}"
        await page.goto(file_uri, wait_until="networkidle")
        
        # Generate PDF matching the template exact layout
        await page.pdf(
            path=pdf_path,
            format="A4",
            print_background=True,
            margin={"top": "0", "right": "0", "bottom": "0", "left": "0"}
        )
        
        await browser.close()
        
    # Clean up temp html
    if os.path.exists(temp_html_path):
        os.remove(temp_html_path)
        
    return pdf_path
