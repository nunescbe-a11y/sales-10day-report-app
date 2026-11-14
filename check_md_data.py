import json
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={'width': 1400, 'height': 850})
    page.goto('http://localhost:5173')
    page.wait_for_timeout(2000)

    # Click Login on Landing Page
    page.get_by_role('link', name='Login').click()
    page.wait_for_timeout(1000)

    # Fill username and password
    page.locator('input[type="text"]').fill('md')
    page.locator('input[type="password"]').fill('md2026')
    page.locator('form button[type="submit"]').click()
    page.wait_for_timeout(2000)

    # Screenshot Tab 1: Executive Charts & KPIs
    page.screenshot(path=r'C:\Users\NUNES\.gemini\antigravity\brain\6e3a986f-0691-409d-9127-c709a98d6fb4\md_analytics_with_data.png')

    # Switch to Tab 2: Master Sales Sheet
    page.locator('button:has-text("Master Sales Sheet")').click()
    page.wait_for_timeout(1000)
    page.screenshot(path=r'C:\Users\NUNES\.gemini\antigravity\brain\6e3a986f-0691-409d-9127-c709a98d6fb4\md_master_sheet_with_data.png')

    # Switch to Tab 3: Staff Filling Hub
    page.locator('button:has-text("Staff Filling & Submissions")').click()
    page.wait_for_timeout(1000)
    page.screenshot(path=r'C:\Users\NUNES\.gemini\antigravity\brain\6e3a986f-0691-409d-9127-c709a98d6fb4\md_staff_hub_with_data.png')

    # Read items in table
    items = page.locator('tbody tr').all_text_contents()
    print(f'Total rows visible in table: {len(items)}')

    # Check for items
    body = page.locator('body').inner_text()
    found = []
    for test_item in ['silicon trowel scaper', 'tabulate hardness tester', 'prismatic compass', 'Magnifying Lamps', 'themo hygro meter']:
        if test_item.lower() in body.lower():
            found.append(test_item)
    print('Found items in MD view:', found)

    browser.close()
    print('Check complete!')
