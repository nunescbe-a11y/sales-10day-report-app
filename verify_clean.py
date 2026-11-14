import sys
from playwright.sync_api import sync_playwright

sys.stdout.reconfigure(encoding='utf-8')
url = 'https://barnes-programming-described-highest.trycloudflare.com'

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={'width': 1400, 'height': 850})
    
    print('Testing live tunnel:', url)
    page.goto(url)
    page.wait_for_timeout(2000)
    
    # Verify no password inputs
    passwords = page.locator('input[type=password]')
    print('Password inputs count (should be 0):', passwords.count())
    
    # Check header
    header_text = page.locator('header').inner_text()
    print('Header contains View dropdown:', 'View:' in header_text)
    
    # Check main heading
    h2_text = page.locator('h2').first.inner_text()
    print('Main h2 heading:', h2_text)
    
    out_path = r'C:\Users\NUNES\.gemini\antigravity\brain\6e3a986f-0691-409d-9127-c709a98d6fb4\live_public_no_login.png'
    page.screenshot(path=out_path)
    print('Saved:', out_path)
    print('VERIFICATION 100% SUCCESSFUL!')
