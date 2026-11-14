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
    page.locator('button[type="submit"]').click()
    page.wait_for_timeout(2000)

    header_text = page.locator('header').inner_text()
    print('Landing Page text in header:', 'Landing Page' in header_text)

    page.screenshot(path=r'C:\Users\NUNES\.gemini\antigravity\brain\6e3a986f-0691-409d-9127-c709a98d6fb4\header_without_landing_page_box.png')
    browser.close()
    print('Header screenshot saved successfully!')
