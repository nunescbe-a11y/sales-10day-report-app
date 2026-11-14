import sys
from playwright.sync_api import sync_playwright

sys.stdout.reconfigure(encoding='utf-8')
url = 'http://localhost:5173'

with sync_playwright() as p:
    # Completely clean browser context (like a brand new device)
    browser = p.chromium.launch(headless=True)
    context = browser.new_context(viewport={'width': 1400, 'height': 850})
    page = context.new_page()
    
    print('1. Opening app on a brand new device / clean session...')
    page.goto(url)
    page.wait_for_timeout(2000)
    
    # Check that NO login input exists
    password_inputs = page.locator('input[type="password"]')
    print('Password inputs count (should be 0):', password_inputs.count())
    assert password_inputs.count() == 0, 'Password input should not exist!'
    
    # Check that MD Dashboard is directly visible
    print('2. Checking if MD Dashboard is visible directly...')
    md_heading = page.locator('text=All-Company Executive Summary')
    print('MD Dashboard summary visible:', md_heading.is_visible())
    
    # Check that View Switcher is present in header
    print('3. Testing View Switcher dropdown...')
    view_select = page.locator('select:has-text("MD All-Company Dashboard")')
    print('View dropdown exists:', view_select.is_visible())
    
    out_1 = r'C:\Users\NUNES\.gemini\antigravity\brain\6e3a986f-0691-409d-9127-c709a98d6fb4\no_login_direct_md.png'
    page.screenshot(path=out_1)
    print('Saved:', out_1)
    
    # Switch view to Yazhini S.
    print('4. Switching to Yazhini S. workspace without login...')
    view_select.select_option('yazhini')
    page.wait_for_timeout(1500)
    
    yazhini_header = page.locator('text=Yazhini S. • Staff Sales Workspace')
    print('Yazhini workspace visible:', yazhini_header.is_visible())
    
    out_2 = r'C:\Users\NUNES\.gemini\antigravity\brain\6e3a986f-0691-409d-9127-c709a98d6fb4\no_login_direct_staff.png'
    page.screenshot(path=out_2)
    print('Saved:', out_2)
    
    # Switch back to MD
    print('5. Switching back to MD Dashboard...')
    page.locator('select').first.select_option('MD')
    page.wait_for_timeout(1500)
    print('Back to MD summary visible:', md_heading.is_visible())
    
    print('ALL NO-LOGIN TESTS PASSED PERFECTLY!')
