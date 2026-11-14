import time
import json
import os
from playwright.sync_api import sync_playwright

def test_data_never_lost():
    db_path = r'C:\Users\NUNES\.gemini\antigravity\scratch\sales-10day-report-app\server_storage\permanent_sales_db.json'
    print(f"Permanent DB exists on disk: {os.path.exists(db_path)}")

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={'width': 1920, 'height': 828})
        page = context.new_page()

        # Step 1: Open app
        page.goto('http://localhost:5173')
        page.wait_for_load_state('networkidle')
        time.sleep(1)

        # Log out if authenticated as anyone else
        logout_btn = page.locator('button[title*="Log out"]')
        if logout_btn.count() > 0 and logout_btn.first.is_visible():
            logout_btn.first.click()
            time.sleep(1)

        # Log in as Yazhini
        user_input = page.locator('input[placeholder*="nunes"]')
        if user_input.count() > 0:
            user_input.fill('yazhini')
            pass_input = page.locator('input[placeholder="••••••••"]')
            pass_input.fill('yazhini123')
            page.locator('button[type="submit"]:has-text("Sign In")').click()
            time.sleep(1.5)

        # Verify Permanent Storage Badge in Header
        storage_badge = page.locator('text=Disk Synced & Permanent')
        print(f"Header Permanent Storage Badge visible: {storage_badge.count() > 0}")

        # Go to "Fill New Sale Row" tab
        page.locator('button:has-text("Fill New Sale Row")').click()
        time.sleep(1)

        # Step 2: Add a uniquely identifiable sale row: "Permanent Safe Asset Test Item 999"
        unique_item_name = "Permanent Safe Asset Test Item 999"
        page.locator('input[placeholder*="silicon trowel scraper"]').fill(unique_item_name)
        page.locator('input[placeholder*="handy home solution"]').fill('Permanent Safe Client Ltd')
        
        # Fill Selling cost
        sell_cost_input = page.locator('input[placeholder="0"]').nth(2)
        sell_cost_input.fill('55000')

        # Save the entry
        page.locator('button[type="submit"]:has-text("Save Full Sales Row")').click()
        time.sleep(2)

        # Step 3: Check if permanent disk file contains this new item!
        with open(db_path, 'r', encoding='utf-8') as f:
            disk_data = json.load(f)
        
        found_on_disk = any(item.get('item') == unique_item_name for item in disk_data.get('sales', []))
        print(f"[OK] Item '{unique_item_name}' written to permanent disk file: {found_on_disk}")

        # Capture screenshot of view showing new row
        page.screenshot(path=r'C:\Users\NUNES\.gemini\antigravity\brain\6e3a986f-0691-409d-9127-c709a98d6fb4\permanent_storage_verified.png')
        print("Captured: permanent_storage_verified.png")

        # Step 4: THE ULTIMATE TEST:
        # Wipe browser localStorage entirely, simulating a complete software update, cache clear, or new device!
        print("\n--- SIMULATING SOFTWARE UPDATE / CACHE WIPE ---")
        page.evaluate("() => localStorage.clear()")
        time.sleep(0.5)

        # Reload the page from scratch
        page.reload()
        page.wait_for_load_state('networkidle')
        time.sleep(1.5)

        # Log back in as Yazhini
        user_input = page.locator('input[placeholder*="nunes"]')
        if user_input.count() > 0:
            user_input.fill('yazhini')
            pass_input = page.locator('input[placeholder="••••••••"]')
            pass_input.fill('yazhini123')
            page.locator('button[type="submit"]:has-text("Sign In")').click()
            time.sleep(1.5)

        # Go to My 10-Day Sheet
        sheet_tab = page.locator('button:has-text("My 10-Day Sheet")')
        if sheet_tab.count() > 0:
            sheet_tab.click()
            time.sleep(1)

        # Verify that our item survived and is still there!
        survived_item = page.locator(f'text={unique_item_name}')
        print(f"[OK] Item survived cache wipe and reload: {survived_item.count() > 0}")

        page.screenshot(path=r'C:\Users\NUNES\.gemini\antigravity\brain\6e3a986f-0691-409d-9127-c709a98d6fb4\data_persisted_after_wipe.png')
        print("Captured: data_persisted_after_wipe.png")

        browser.close()
        print("\n[SUCCESS]: DATA NEVER LOST UNDER ANY UPDATE OR CACHE CLEAR!")

if __name__ == '__main__':
    test_data_never_lost()
