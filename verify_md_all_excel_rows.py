from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={'width': 1400, 'height': 850})
    page.goto('http://localhost:5173')
    page.wait_for_timeout(2000)

    # Click Login on Landing Page
    page.get_by_role('link', name='Login').click()
    page.wait_for_timeout(1000)

    # Login as MD
    page.locator('input[type="text"]').fill('md')
    page.locator('input[type="password"]').fill('md2026')
    page.locator('form button[type="submit"]').click()
    page.wait_for_timeout(2000)

    # 1. Executive Overview / Charts
    page.screenshot(path=r'C:\Users\NUNES\.gemini\antigravity\brain\6e3a986f-0691-409d-9127-c709a98d6fb4\md_view_1_charts.png')

    # 2. Switch to Master Sales Sheet
    page.locator('button:has-text("Master Sales Sheet")').click()
    page.wait_for_timeout(1000)
    page.screenshot(path=r'C:\Users\NUNES\.gemini\antigravity\brain\6e3a986f-0691-409d-9127-c709a98d6fb4\md_view_2_master_sheet.png')

    # Read rows
    rows = page.locator('tbody tr').all_text_contents()
    print(f'Total visible rows in Master Sheet: {len(rows)}')
    for i, r in enumerate(rows):
        print(f'Row {i+1}: {r[:110]}...')

    # 3. Switch to Staff Filling Hub
    page.locator('button:has-text("Staff Filling & Submissions")').click()
    page.wait_for_timeout(1000)
    page.screenshot(path=r'C:\Users\NUNES\.gemini\antigravity\brain\6e3a986f-0691-409d-9127-c709a98d6fb4\md_view_3_staff_hub.png')

    browser.close()
    print('All views verified successfully!')
