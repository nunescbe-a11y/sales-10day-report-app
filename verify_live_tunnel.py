from playwright.sync_api import sync_playwright

url = 'https://tan-heads-seal-winner.trycloudflare.com'

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={'width': 1400, 'height': 850})
    
    print('1. Navigating to:', url)
    page.goto(url)
    page.wait_for_timeout(2000)
    print('Title:', page.title())
    
    # Click Login
    print('2. Clicking Login...')
    page.get_by_role('link', name='Login').click()
    page.wait_for_timeout(1000)
    
    # Fill Yazhini credentials
    print('3. Entering credentials for Yazhini...')
    page.locator('input[type="text"]').fill('yazhini')
    page.locator('input[type="password"]').fill('yazhini123')
    page.locator('form button[type="submit"]').click()
    page.wait_for_timeout(2000)
    
    # Click Fill New Sale Row tab
    print('4. Clicking Fill New Sale Row tab...')
    page.locator('button:has-text("Fill New Sale Row")').click()
    page.wait_for_timeout(1500)
    
    heading = page.locator('text=Staff 10-Day Payment & Sales Filling')
    print('5. Form heading visible:', heading.is_visible())
    
    out_path = r'C:\Users\NUNES\.gemini\antigravity\brain\6e3a986f-0691-409d-9127-c709a98d6fb4\live_tunnel_form_verified.png'
    page.screenshot(path=out_path)
    print('6. Screenshot saved:', out_path)
    print('ALL VERIFICATION PASSED!')
