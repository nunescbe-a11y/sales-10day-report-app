from playwright.sync_api import sync_playwright
import shutil

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={'width': 1440, 'height': 900})
    page.goto('http://localhost:5173', wait_until='networkidle')
    page.wait_for_timeout(600)

    # If logged in, log out to see the landing page
    try:
        logout_btn = page.locator('button[title*="Log out"]')
        if logout_btn.is_visible():
            logout_btn.click()
            page.wait_for_timeout(600)
    except:
        pass

    # 1. Capture the Motion Landing Page with Animated Background & Character Pedestal
    page.screenshot(path='C:/Users/NUNES/.gemini/antigravity/scratch/sales-10day-report-app/motion_landing_page.png')

    # 2. Test typing in the input to trigger the boy's 'typing' focus state
    page.locator('input[type="text"]').click()
    page.wait_for_timeout(400)
    page.screenshot(path='C:/Users/NUNES/.gemini/antigravity/scratch/sales-10day-report-app/motion_landing_typing.png')

    # 3. Test wrong password -> boy crying on the motion landing page
    page.locator('input[type="password"]').fill('badpass999')
    page.locator('button[type="submit"]').click()
    page.wait_for_timeout(500)
    page.screenshot(path='C:/Users/NUNES/.gemini/antigravity/scratch/sales-10day-report-app/motion_landing_sad.png')

    # 4. Test correct password -> boy kissing with floating hearts on motion landing page
    page.locator('input[type="password"]').fill('yazhini123')
    page.locator('button[type="submit"]').click()
    page.wait_for_timeout(400)
    page.screenshot(path='C:/Users/NUNES/.gemini/antigravity/scratch/sales-10day-report-app/motion_landing_kiss.png')

    browser.close()

# Copy to brain artifact directory
for fname in [
    'motion_landing_page.png',
    'motion_landing_typing.png',
    'motion_landing_sad.png',
    'motion_landing_kiss.png'
]:
    shutil.copy(
        f'C:/Users/NUNES/.gemini/antigravity/scratch/sales-10day-report-app/{fname}',
        f'C:/Users/NUNES/.gemini/antigravity/brain/6e3a986f-0691-409d-9127-c709a98d6fb4/{fname}'
    )

print("All motion landing screenshots captured and copied successfully!")
