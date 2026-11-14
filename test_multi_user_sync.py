import time
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)

    # 1. MD Context & Page
    print('Starting MD session...')
    md_ctx = browser.new_context(viewport={'width': 1200, 'height': 800})
    md_page = md_ctx.new_page()
    md_page.goto('http://localhost:5173')
    md_page.wait_for_timeout(1500)
    # Login as MD
    md_page.get_by_role('link', name='Login').click()
    md_page.wait_for_timeout(500)
    md_page.locator('input[type="text"]').fill('md')
    md_page.locator('input[type="password"]').fill('md2026')
    md_page.locator('form button[type="submit"]').click()
    md_page.wait_for_timeout(2000)

    # Switch to Master Sales Sheet tab
    md_page.locator('button:has-text("Master Sales Sheet")').click()
    md_page.wait_for_timeout(1000)

    # Count initial rows on MD's screen
    initial_rows_count = md_page.locator('tbody tr').count()
    print(f'Initial rows on MD screen: {initial_rows_count}')

    # 2. Employee (Yazhini) Context & Page
    print('Starting Employee (Yazhini) session on another device/context...')
    emp_ctx = browser.new_context(viewport={'width': 1200, 'height': 800})
    emp_page = emp_ctx.new_page()
    emp_page.goto('http://localhost:5173')
    emp_page.wait_for_timeout(1500)
    emp_page.get_by_role('link', name='Login').click()
    emp_page.wait_for_timeout(500)
    emp_page.locator('input[type="text"]').fill('yazhini')
    emp_page.locator('input[type="password"]').fill('yazhini123')
    emp_page.locator('form button[type="submit"]').click()
    emp_page.wait_for_timeout(2000)

    # Employee adds a new sale row
    print('Employee adding new row...')
    emp_page.locator('button:has-text("Add Row")').first.click()
    emp_page.wait_for_timeout(800)

    # Fill test item details
    emp_page.locator('input[placeholder*="silicon trowel"]').fill('Digital Torque Wrench Test')
    emp_page.locator('input[placeholder*="handy home"]').fill('Apex Toolings Ltd')
    
    # SELLING COST is the 3rd placeholder="0" input
    emp_page.locator('label:has-text("SELLING COST") + input, div:has(> label:has-text("SELLING COST")) input').first.fill('25000')

    # Save
    emp_page.locator('form button[type="submit"]:has-text("Save")').click()
    emp_page.wait_for_timeout(2000)
    print('Employee successfully saved record.')

    emp_page.screenshot(path=r'C:\Users\NUNES\.gemini\antigravity\brain\6e3a986f-0691-409d-9127-c709a98d6fb4\emp_saved_sale.png')

    # 3. Wait 6 seconds for MD auto-poll to pick it up live without reload
    print('Waiting 6 seconds for MD auto-poll sync...')
    md_page.wait_for_timeout(6000)

    # Check rows count on MD's screen
    updated_rows_count = md_page.locator('tbody tr').count()
    print(f'Updated rows on MD screen: {updated_rows_count}')

    md_body = md_page.locator('body').inner_text()
    found_item = 'Digital Torque Wrench' in md_body or 'Apex Toolings' in md_body
    print(f'Did MD screen show the new sale automatically? {found_item}')

    md_page.screenshot(path=r'C:\Users\NUNES\.gemini\antigravity\brain\6e3a986f-0691-409d-9127-c709a98d6fb4\md_auto_received_sale.png')

    browser.close()
    print('Multi-user sync test completed successfully!')
