from playwright.sync_api import sync_playwright
import shutil

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={'width': 1440, 'height': 900})
    page.goto('http://localhost:5173', wait_until='networkidle')
    page.wait_for_timeout(600)

    # 1. Login as Yazhini if not logged in
    try:
        logout_btn = page.locator('button[title*="Log out"]')
        if logout_btn.is_visible():
            logout_btn.click()
            page.wait_for_timeout(600)
    except:
        pass

    page.locator('input[type="text"]').fill('yazhini')
    page.locator('input[type="password"]').fill('yazhini123')
    page.locator('button[type="submit"]').click()
    page.wait_for_timeout(1800)

    # 2. Go to Fill New Sale Row Tab
    page.locator('button:has-text("Fill New Sale Row")').click()
    page.wait_for_timeout(500)

    # Take screenshot of the initial form with updated labels
    page.screenshot(path='C:/Users/NUNES/.gemini/antigravity/scratch/sales-10day-report-app/form_cost_labels.png')

    # 3. Click '+ Add Status' button
    page.locator('button:has-text("Add Status")').click()
    page.wait_for_timeout(300)

    # Screenshot of open Add Status Drawer
    page.screenshot(path='C:/Users/NUNES/.gemini/antigravity/scratch/sales-10day-report-app/status_add_drawer.png')

    # Fill new status text and save
    page.locator('input[placeholder*="Sent for Calibration"]').fill('Customs clearance & Testing in Progress')
    page.locator('button:has-text("Save Status")').click()
    page.wait_for_timeout(500)

    # Screenshot of newly added status chip selected
    page.screenshot(path='C:/Users/NUNES/.gemini/antigravity/scratch/sales-10day-report-app/status_custom_added.png')

    # 4. Test Rename: click the pencil icon on "saled"
    page.locator('button[title*="saled"]').first.click()
    page.wait_for_timeout(300)
    page.screenshot(path='C:/Users/NUNES/.gemini/antigravity/scratch/sales-10day-report-app/status_rename_inline.png')

    # Save rename
    page.locator('button[title="Save Rename"]').click()
    page.wait_for_timeout(300)

    # 5. Switch to Sheet Tab to verify table headers
    page.locator('button:has-text("My 10-Day Sheet")').click()
    page.wait_for_timeout(500)
    page.screenshot(path='C:/Users/NUNES/.gemini/antigravity/scratch/sales-10day-report-app/table_headers_clarity.png')

    browser.close()

# Copy to brain artifact directory
for fname in [
    'form_cost_labels.png',
    'status_add_drawer.png',
    'status_custom_added.png',
    'status_rename_inline.png',
    'table_headers_clarity.png'
]:
    shutil.copy(
        f'C:/Users/NUNES/.gemini/antigravity/scratch/sales-10day-report-app/{fname}',
        f'C:/Users/NUNES/.gemini/antigravity/brain/6e3a986f-0691-409d-9127-c709a98d6fb4/{fname}'
    )

print("All status customization and cost label tests captured successfully!")
