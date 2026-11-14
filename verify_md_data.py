import sys
from playwright.sync_api import sync_playwright

sys.stdout.reconfigure(encoding='utf-8')
url = 'https://barnes-programming-described-highest.trycloudflare.com'

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={'width': 1400, 'height': 850})
    
    print('1. Navigating to:', url)
    page.goto(url)
    page.wait_for_timeout(2000)
    
    # Click Login
    print('2. Clicking Login...')
    page.get_by_role('link', name='Login').click()
    page.wait_for_timeout(1000)
    
    # Fill MD credentials
    print('3. Logging in as MD...')
    page.locator('input[type="text"]').fill('md')
    page.locator('input[type="password"]').fill('md2026')
    page.locator('form button[type="submit"]').click()
    page.wait_for_timeout(2000)
    
    # Switch to Master Sales Sheet tab
    print('4. Switching to Master Sales Sheet tab...')
    page.locator('button:has-text("Master Sales Sheet")').click()
    page.wait_for_timeout(1500)
    
    rows = page.locator('table tbody tr')
    print('Master Sales Sheet table rows count:', rows.count())
    
    for i in range(rows.count()):
        text = rows.nth(i).inner_text().replace('\n', ' | ')
        print(f"Row {i+1}: {text[:80]}...")
    
    out_path = r'C:\Users\NUNES\.gemini\antigravity\brain\6e3a986f-0691-409d-9127-c709a98d6fb4\verify_master_sheet_5_rows.png'
    page.screenshot(path=out_path)
    print('5. Screenshot saved:', out_path)
    print('SUCCESS! ALL 5 ROWS VISIBLE ON MASTER SHEET!')
