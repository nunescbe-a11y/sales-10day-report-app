import sys
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={'width': 1400, 'height': 850})

    # 1. Landing/Login page
    page.goto('http://localhost:5173')
    page.wait_for_timeout(2000)
    page.screenshot(path=r'C:\Users\NUNES\.gemini\antigravity\brain\6e3a986f-0691-409d-9127-c709a98d6fb4\check_1_login.png')
    print('1. Login page saved')

    # Fill username and password for MD
    page.locator('input[type="text"]').fill('md')
    page.locator('input[type="password"]').fill('md2026')
    page.locator('button[type="submit"]').click()
    page.wait_for_timeout(2000)
    page.screenshot(path=r'C:\Users\NUNES\.gemini\antigravity\brain\6e3a986f-0691-409d-9127-c709a98d6fb4\check_2_md_analytics.png')
    print('2. MD Analytics saved')

    # MD Master Sheet tab
    page.locator('button:has-text("Master Sales Sheet")').click()
    page.wait_for_timeout(1000)
    page.screenshot(path=r'C:\Users\NUNES\.gemini\antigravity\brain\6e3a986f-0691-409d-9127-c709a98d6fb4\check_3_md_sheet.png')
    print('3. MD Master Sheet saved')

    # MD Staff Hub tab
    page.locator('button:has-text("Staff Filling & Submissions")').click()
    page.wait_for_timeout(1000)
    page.screenshot(path=r'C:\Users\NUNES\.gemini\antigravity\brain\6e3a986f-0691-409d-9127-c709a98d6fb4\check_4_md_staff.png')
    print('4. MD Staff Hub saved')

    # MD Cycle tab
    page.locator('button:has-text("10-Day Cycle Live Timer")').click()
    page.wait_for_timeout(1000)
    page.screenshot(path=r'C:\Users\NUNES\.gemini\antigravity\brain\6e3a986f-0691-409d-9127-c709a98d6fb4\check_5_md_cycle.png')
    print('5. MD Cycles saved')

    # Logout and login as Yazhini
    page.locator('button[title="Log out of Cloudflare Session"]').click()
    page.wait_for_timeout(1500)
    page.locator('input[type="text"]').fill('yazhini')
    page.locator('input[type="password"]').fill('yazhini123')
    page.locator('button[type="submit"]').click()
    page.wait_for_timeout(2000)
    page.screenshot(path=r'C:\Users\NUNES\.gemini\antigravity\brain\6e3a986f-0691-409d-9127-c709a98d6fb4\check_6_yazhini_sheet.png')
    print('6. Yazhini Sheet saved')

    browser.close()
print('All 6 screens saved!')
