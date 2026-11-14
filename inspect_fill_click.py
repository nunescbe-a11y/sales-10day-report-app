from playwright.sync_api import sync_playwright

console_messages = []
errors = []

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={'width': 1400, 'height': 850})
    
    page.on('console', lambda msg: console_messages.append(f'[{msg.type}] {msg.text}'))
    page.on('pageerror', lambda err: errors.append(str(err)))

    page.goto('http://localhost:5173')
    page.wait_for_timeout(2000)
    
    page.get_by_role('link', name='Login').click()
    page.wait_for_timeout(1000)

    page.locator('input[type="text"]').fill('yazhini')
    page.locator('input[type="password"]').fill('yazhini123')
    page.locator('form button[type="submit"]').click()
    page.wait_for_timeout(2000)

    print("Before click, page title/text:", page.title())
    print("Clicking Fill New Sale Row...")
    page.locator('button:has-text("Fill New Sale Row")').click()
    page.wait_for_timeout(2000)

    print("Errors after click:", errors)
    print("Console errors:", [m for m in console_messages if 'error' in m.lower()])
    
    # Check what is rendered in #root
    content = page.content()
    print("Content length:", len(content))
    with open(r'C:\Users\NUNES\.gemini\antigravity\scratch\sales-10day-report-app\page_after_fill_click.html', 'w', encoding='utf-8') as f:
        f.write(content)
        
    print("Saved page_after_fill_click.html")
