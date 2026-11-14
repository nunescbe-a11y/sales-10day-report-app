from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={'width': 1400, 'height': 850})

    # Test 1: Landing page -> Click Login
    print('Checking Landing Page -> Login...')
    page.goto('http://localhost:5173')
    page.wait_for_timeout(2000)
    page.get_by_role('link', name='Login').click()
    page.wait_for_timeout(1000)
    page.screenshot(path=r'C:\Users\NUNES\.gemini\antigravity\brain\6e3a986f-0691-409d-9127-c709a98d6fb4\debug_form_1_login.png')

    # Login as Yazhini
    page.locator('input[type="text"]').fill('yazhini')
    page.locator('input[type="password"]').fill('yazhini123')
    page.locator('form button[type="submit"]').click()
    page.wait_for_timeout(2000)

    # Test 2: In Yazhini workspace, click '+ Fill New Sale Row' tab
    print('Checking Yazhini workspace tab "+ Fill New Sale Row"...')
    page.locator('button:has-text("Fill New Sale Row")').click()
    page.wait_for_timeout(1500)
    page.screenshot(path=r'C:\Users\NUNES\.gemini\antigravity\brain\6e3a986f-0691-409d-9127-c709a98d6fb4\debug_form_2_rep_fill_tab.png')

    # Test 3: In Yazhini workspace, click '+ Add Row' button in header
    print('Checking Yazhini workspace "+ Add Row" modal...')
    page.locator('button:has-text("Add Row")').first.click()
    page.wait_for_timeout(1500)
    page.screenshot(path=r'C:\Users\NUNES\.gemini\antigravity\brain\6e3a986f-0691-409d-9127-c709a98d6fb4\debug_form_3_rep_add_modal.png')
    page.locator('button:has-text("Cancel")').click()
    page.wait_for_timeout(500)

    # Logout and login as MD
    print('Checking MD workspace...')
    page.locator('button[title="Log out of Cloudflare Session"]').click()
    page.wait_for_timeout(1000)
    page.get_by_role('link', name='Login').click()
    page.wait_for_timeout(500)
    page.locator('input[type="text"]').fill('md')
    page.locator('input[type="password"]').fill('md2026')
    page.locator('form button[type="submit"]').click()
    page.wait_for_timeout(2000)

    # Test 4: In MD workspace, click 'Record Sale' / 'Add Row'
    print('Checking MD workspace "+ Add Row" modal...')
    page.locator('button:has-text("Record Sale")').click()
    page.wait_for_timeout(1500)
    page.screenshot(path=r'C:\Users\NUNES\.gemini\antigravity\brain\6e3a986f-0691-409d-9127-c709a98d6fb4\debug_form_4_md_add_modal.png')

    browser.close()
    print('Done checking all forms!')
