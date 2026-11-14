from playwright.sync_api import sync_playwright
import shutil
import time

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={'width': 1440, 'height': 900})
    page.goto('http://localhost:5173', wait_until='networkidle')
    page.wait_for_timeout(600)

    # 1. Ensure on login screen by logging out if authenticated
    try:
        logout_btn = page.locator('button[title*="Log out"]')
        if logout_btn.is_visible():
            logout_btn.click()
            page.wait_for_timeout(600)
    except:
        pass

    # 2. Test Wrong Password -> Sad Crying Boy
    page.locator('input[type="text"]').fill('yazhini')
    page.locator('input[type="password"]').fill('wrongpassword123')
    page.locator('button[type="submit"]').click()
    page.wait_for_timeout(500)
    page.screenshot(path='C:/Users/NUNES/.gemini/antigravity/scratch/sales-10day-report-app/boy_sad_crying.png')

    # 3. Test Correct Password -> Kissing Boy
    page.locator('input[type="password"]').fill('yazhini123')
    page.locator('button[type="submit"]').click()
    page.wait_for_timeout(400)
    page.screenshot(path='C:/Users/NUNES/.gemini/antigravity/scratch/sales-10day-report-app/boy_kissing_happy.png')

    # 4. Wait for login to complete and show Employee View
    page.wait_for_timeout(1800)
    page.screenshot(path='C:/Users/NUNES/.gemini/antigravity/scratch/sales-10day-report-app/employee_sheet_view.png', full_page=True)

    # 5. Click the "Fill New Sale Row" tab
    page.locator('button:has-text("Fill New Sale Row")').click()
    page.wait_for_timeout(400)
    page.screenshot(path='C:/Users/NUNES/.gemini/antigravity/scratch/sales-10day-report-app/employee_quick_fill_view.png', full_page=True)

    # 6. Fill a row and test Runner Celebration
    page.locator('input[placeholder*="silicon trowel scraper"]').fill('Digital Vernier Caliper 150mm')
    page.locator('input[placeholder*="handy home solution"]').fill('Apollo Precision Engineering')
    page.locator('input[placeholder*="0"]').nth(0).fill('2500') # pur cost
    page.locator('input[placeholder*="0"]').nth(1).fill('6500') # sell cost
    page.locator('input[placeholder*="0"]').nth(2).fill('6500') # advance
    page.wait_for_timeout(300)
    
    # Click Save & Trigger Runner
    page.locator('button:has-text("Save Sales Row & Trigger Runner")').click()
    # Capture runner mid-sprint across screen
    page.wait_for_timeout(700)
    page.screenshot(path='C:/Users/NUNES/.gemini/antigravity/scratch/sales-10day-report-app/boy_runner_celebration.png')

    browser.close()

# Copy to brain artifact directory
shutil.copy('C:/Users/NUNES/.gemini/antigravity/scratch/sales-10day-report-app/boy_sad_crying.png', 'C:/Users/NUNES/.gemini/antigravity/brain/6e3a986f-0691-409d-9127-c709a98d6fb4/boy_sad_crying.png')
shutil.copy('C:/Users/NUNES/.gemini/antigravity/scratch/sales-10day-report-app/boy_kissing_happy.png', 'C:/Users/NUNES/.gemini/antigravity/brain/6e3a986f-0691-409d-9127-c709a98d6fb4/boy_kissing_happy.png')
shutil.copy('C:/Users/NUNES/.gemini/antigravity/scratch/sales-10day-report-app/employee_quick_fill_view.png', 'C:/Users/NUNES/.gemini/antigravity/brain/6e3a986f-0691-409d-9127-c709a98d6fb4/employee_quick_fill_view.png')
shutil.copy('C:/Users/NUNES/.gemini/antigravity/scratch/sales-10day-report-app/boy_runner_celebration.png', 'C:/Users/NUNES/.gemini/antigravity/brain/6e3a986f-0691-409d-9127-c709a98d6fb4/boy_runner_celebration.png')

print("All boy animations, quick filling, and runner celebration captured!")
