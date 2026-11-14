from playwright.sync_api import sync_playwright
import shutil

with sync_playwright() as p:
    browser = p.chromium.launch()
    context = browser.new_context()
    page = context.new_page()
    page.goto('http://localhost:5173')
    # Clear localStorage so it starts logged out
    page.evaluate("localStorage.clear()")
    page.reload()
    page.wait_for_timeout(500)
    
    # 1. Click 'Log out' if still shown
    logout_btns = page.locator('button[title*="Log out"]')
    if logout_btns.count() > 0:
        logout_btns.first.click()
        page.wait_for_timeout(500)

    # 2. Fill login form
    page.locator('input[type="text"]').fill('yazhini')
    page.locator('input[type="password"]').fill('yazhini123')
    
    # Click Submit and take screenshot after 200ms
    page.locator('button[type="submit"]').click()
    page.wait_for_timeout(200)
    page.screenshot(path='C:/Users/NUNES/.gemini/antigravity/scratch/sales-10day-report-app/boy_kissing_happy.png')
    browser.close()

shutil.copy('C:/Users/NUNES/.gemini/antigravity/scratch/sales-10day-report-app/boy_kissing_happy.png', 'C:/Users/NUNES/.gemini/antigravity/brain/6e3a986f-0691-409d-9127-c709a98d6fb4/boy_kissing_happy.png')
print("Kissing screenshot captured cleanly!")
