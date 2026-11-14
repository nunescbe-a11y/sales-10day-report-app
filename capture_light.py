from playwright.sync_api import sync_playwright
import shutil

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={'width': 1440, 'height': 900})
    page.goto('http://localhost:5173', wait_until='networkidle')
    page.wait_for_timeout(600)
    
    # 1. Capture MD Dashboard in Light Theme
    page.screenshot(path='C:/Users/NUNES/.gemini/antigravity/scratch/sales-10day-report-app/light_md_dashboard.png', full_page=True)
    
    # 2. Click Logout to view Cloudflare Login
    page.locator('button[title*="Log out"]').click()
    page.wait_for_timeout(600)
    page.screenshot(path='C:/Users/NUNES/.gemini/antigravity/scratch/sales-10day-report-app/light_cloudflare_login.png')
    
    # 3. Switch to Employee and sign in as Yazhini
    page.get_by_role('button', name='Sales Representative').click()
    page.wait_for_timeout(300)
    page.locator('button[type="submit"]').click()
    page.wait_for_timeout(600)
    page.screenshot(path='C:/Users/NUNES/.gemini/antigravity/scratch/sales-10day-report-app/light_employee_single_view.png', full_page=True)
    
    browser.close()

# Copy to brain artifact directory
shutil.copy('C:/Users/NUNES/.gemini/antigravity/scratch/sales-10day-report-app/light_md_dashboard.png', 'C:/Users/NUNES/.gemini/antigravity/brain/6e3a986f-0691-409d-9127-c709a98d6fb4/light_md_dashboard.png')
shutil.copy('C:/Users/NUNES/.gemini/antigravity/scratch/sales-10day-report-app/light_cloudflare_login.png', 'C:/Users/NUNES/.gemini/antigravity/brain/6e3a986f-0691-409d-9127-c709a98d6fb4/light_cloudflare_login.png')
shutil.copy('C:/Users/NUNES/.gemini/antigravity/scratch/sales-10day-report-app/light_employee_single_view.png', 'C:/Users/NUNES/.gemini/antigravity/brain/6e3a986f-0691-409d-9127-c709a98d6fb4/light_employee_single_view.png')

print("All light screenshots captured and copied successfully!")
