from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={'width': 1400, 'height': 850})
    page.goto('http://localhost:5173')
    page.wait_for_timeout(1000)
    page.locator('input[type="text"]').fill('md')
    page.locator('input[type="password"]').fill('md2026')
    page.locator('button[type="submit"]').click()
    page.wait_for_timeout(1500)
    page.locator('button:has-text("Staff Filling & Submissions")').click()
    page.wait_for_timeout(1000)

    content = page.content()
    for name in ['Pranesh', 'pranesh', 'Mina 3D', 'Mina 100', 'CYCLE CLOSES IN']:
        print(f'{name} in DOM: {name in content}')

    cards = page.locator('div, h3, h4, span').all_text_contents()
    staff_names = set([t.strip() for t in cards if any(rep in t.lower() for rep in ['yazhini', 'naveena', 'janani', 'pranesh', 'stock']) and len(t.strip()) < 30])
    print('Staff matches in DOM:', staff_names)

    browser.close()
