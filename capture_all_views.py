from playwright.sync_api import sync_playwright
import shutil

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={'width': 1440, 'height': 900})
    page.goto('http://localhost:5173', wait_until='networkidle')
    page.wait_for_timeout(600)

    # 1. Login as MD
    try:
        logout_btn = page.locator('button[title*="Log out"]')
        if logout_btn.is_visible():
            logout_btn.click()
            page.wait_for_timeout(500)
    except:
        pass

    page.locator('input[type="text"]').fill('md')
    page.locator('input[type="password"]').fill('md2026')
    page.locator('button[type="submit"]').click()
    page.wait_for_timeout(1800)

    # Capture MD Charts Tab
    page.screenshot(path='C:/Users/NUNES/.gemini/antigravity/scratch/sales-10day-report-app/light_md_charts.png')

    # Switch to Master Sales Sheet Tab
    page.locator('button:has-text("Master Sales Sheet")').click()
    page.wait_for_timeout(500)
    page.screenshot(path='C:/Users/NUNES/.gemini/antigravity/scratch/sales-10day-report-app/light_md_master_sheet.png')

    # Switch to Staff & Passwords Tab
    page.locator('button:has-text("Staff & Passwords")').click()
    page.wait_for_timeout(500)
    page.screenshot(path='C:/Users/NUNES/.gemini/antigravity/scratch/sales-10day-report-app/light_md_staff_passwords.png')

    # Open Password Reset Modal
    page.locator('button:has-text("Reset Password")').first.click()
    page.wait_for_timeout(500)
    page.screenshot(path='C:/Users/NUNES/.gemini/antigravity/scratch/sales-10day-report-app/light_password_reset_modal.png')
    page.locator('button:has-text("Cancel")').click()
    page.wait_for_timeout(300)

    # Logout and log in as Yazhini (Staff)
    page.locator('button[title*="Log out"]').click()
    page.wait_for_timeout(600)
    page.locator('input[type="text"]').fill('yazhini')
    page.locator('input[type="password"]').fill('yazhini123')
    page.locator('button[type="submit"]').click()
    page.wait_for_timeout(1800)

    # Yazhini Sheet Tab
    page.screenshot(path='C:/Users/NUNES/.gemini/antigravity/scratch/sales-10day-report-app/light_yazhini_sheet.png')

    # Yazhini Fill Tab
    page.locator('button:has-text("Fill New Sale Row")').click()
    page.wait_for_timeout(400)
    page.screenshot(path='C:/Users/NUNES/.gemini/antigravity/scratch/sales-10day-report-app/light_yazhini_fill.png')

    browser.close()

# Copy to brain artifact directory
for fname in [
    'light_md_charts.png',
    'light_md_master_sheet.png',
    'light_md_staff_passwords.png',
    'light_password_reset_modal.png',
    'light_yazhini_sheet.png',
    'light_yazhini_fill.png'
]:
    shutil.copy(
        f'C:/Users/NUNES/.gemini/antigravity/scratch/sales-10day-report-app/{fname}',
        f'C:/Users/NUNES/.gemini/antigravity/brain/6e3a986f-0691-409d-9127-c709a98d6fb4/{fname}'
    )

print("All application states captured and copied successfully!")
