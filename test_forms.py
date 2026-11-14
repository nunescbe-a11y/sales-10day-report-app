import sys
from playwright.sync_api import sync_playwright

console_messages = []
errors = []

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={'width': 1400, 'height': 850})
    
    page.on('console', lambda msg: console_messages.append(f'[{msg.type}] {msg.text}'))
    page.on('pageerror', lambda err: errors.append(str(err)))

    print('1. Opening app...')
    page.goto('http://localhost:5173')
    page.wait_for_timeout(2000)
    
    print('2. Clicking Login link on navbar...')
    page.get_by_role('link', name='Login').click()
    page.wait_for_timeout(1000)

    print('3. Logging in as Yazhini...')
    page.locator('input[type="text"]').fill('yazhini')
    page.locator('input[type="password"]').fill('yazhini123')
    page.locator('form button[type="submit"]').click()
    page.wait_for_timeout(2000)

    print('4. Clicking Fill New Sale Row tab...')
    page.locator('button:has-text("Fill New Sale Row")').click()
    page.wait_for_timeout(1500)
    page.screenshot(path=r'C:\Users\NUNES\.gemini\antigravity\brain\6e3a986f-0691-409d-9127-c709a98d6fb4\verified_form_staff_fill_tab.png')

    print('5. Clicking Add Row in top header...')
    add_row_btn = page.locator('header button:has-text("Add Row")')
    if add_row_btn.count() > 0:
        add_row_btn.first.click()
        page.wait_for_timeout(1500)
        page.screenshot(path=r'C:\Users\NUNES\.gemini\antigravity\brain\6e3a986f-0691-409d-9127-c709a98d6fb4\verified_form_add_modal.png')
        # Close modal
        close_btn = page.locator('button:has(svg.lucide-x)')
        if close_btn.count() > 0:
            close_btn.first.click()
        else:
            page.keyboard.press('Escape')
        page.wait_for_timeout(500)

    print('6. Clicking My 10-Day Sheet tab...')
    page.locator('button:has-text("My 10-Day Sheet")').click()
    page.wait_for_timeout(1500)
    page.screenshot(path=r'C:\Users\NUNES\.gemini\antigravity\brain\6e3a986f-0691-409d-9127-c709a98d6fb4\verified_staff_sheet.png')

    # Logout and login as MD
    print('7. Logging out and testing MD dashboard...')
    logout_btn = page.locator('button[title="Log out of Cloudflare Session"]')
    if logout_btn.count() > 0:
        logout_btn.click()
        page.wait_for_timeout(1000)
        page.get_by_role('link', name='Login').click()
        page.wait_for_timeout(1000)
        page.locator('input[type="text"]').fill('md')
        page.locator('input[type="password"]').fill('md2026')
        page.locator('form button[type="submit"]').click()
        page.wait_for_timeout(2000)

        print('8. Clicking Record Sale on MD dashboard...')
        record_sale_btn = page.locator('button:has-text("Record Sale")')
        if record_sale_btn.count() > 0:
            record_sale_btn.first.click()
            page.wait_for_timeout(1500)
            page.screenshot(path=r'C:\Users\NUNES\.gemini\antigravity\brain\6e3a986f-0691-409d-9127-c709a98d6fb4\verified_form_md_record_modal.png')
            page.keyboard.press('Escape')
            page.wait_for_timeout(500)

    print('Console Errors:', errors)
    print('Recent Console Messages:', [m for m in console_messages if 'error' in m.lower() or 'warn' in m.lower()][:10])
    print('ALL VERIFICATION COMPLETE!')
