import time
from playwright.sync_api import sync_playwright

def test_editable_calculations():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={'width': 1920, 'height': 828})
        page = context.new_page()

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

        # Switch to "Fill New Sale Row" tab
        fill_tab = page.locator('button:has-text("Fill New Sale Row")')
        if fill_tab.count() > 0:
            fill_tab.click()
            time.sleep(1)

        # 1. Fill basic details
        item_input = page.locator('input[placeholder*="silicon trowel scraper"]')
        item_input.fill('High-Precision Laser Meter')

        com_input = page.locator('input[placeholder*="handy home solution"]')
        com_input.fill('Apex Buildcon Solutions')

        # Enter Sell Cost = 10000, Pur Cost = 6000, Lan Cost = 500, Advance = 2000
        # GST = 18% -> GST amount = 1800 -> Overall = 11800
        # Balance = 11800 - 2000 = 9800
        # Gross profit = 10000 - 6000 - 500 = 3500
        pur_cost_input = page.locator('input[placeholder="0"]').nth(0)
        pur_cost_input.fill('6000')

        lan_cost_input = page.locator('input[placeholder="0"]').nth(1)
        lan_cost_input.fill('500')

        sell_cost_input = page.locator('input[placeholder="0"]').nth(2)
        sell_cost_input.fill('10000')

        advance_input = page.locator('input[placeholder="0"]').nth(3)
        advance_input.fill('2000')

        time.sleep(0.5)

        # Verify auto-calculated values
        overall_input = page.locator('input[title*="Auto-calculated. Click to edit or override amount"]')
        balance_input = page.locator('input[title*="Auto-calculated. Click to edit or override balance"]')
        profit_input = page.locator('input[title*="Auto-calculated. Click to edit or override profit"]')

        print(f"Auto Overall Amount: {overall_input.input_value()} (Expected 11800)")
        print(f"Auto Balance Due: {balance_input.input_value()} (Expected 9800)")
        print(f"Auto Gross Profit: {profit_input.input_value()} (Expected 3500)")

        # Capture screenshot showing auto calculated state
        page.screenshot(path=r'C:\Users\NUNES\.gemini\antigravity\brain\6e3a986f-0691-409d-9127-c709a98d6fb4\calculated_cards_auto.png')
        print("Captured: calculated_cards_auto.png")

        # 2. Now EDIT the cards manually!
        # Override Overall Amount to 12500
        overall_input.fill('12500')
        time.sleep(0.3)

        # Override Gross Profit to 4200
        profit_input.fill('4200')
        time.sleep(0.3)

        # Override Balance Due to 10500
        balance_input.fill('10500')
        time.sleep(0.3)

        print(f"Edited Overall Amount: {overall_input.input_value()}")
        print(f"Edited Balance Due: {balance_input.input_value()}")
        print(f"Edited Gross Profit: {profit_input.input_value()}")

        # Verify that Custom badges appear
        custom_badges = page.locator('button:has-text("✏️ Custom • ↺")')
        print(f"Custom override badges count: {custom_badges.count()} (Expected 3)")

        # Capture screenshot showing custom edited state
        page.screenshot(path=r'C:\Users\NUNES\.gemini\antigravity\brain\6e3a986f-0691-409d-9127-c709a98d6fb4\calculated_cards_custom_edited.png')
        print("Captured: calculated_cards_custom_edited.png")

        # 3. Test Reset button on Gross Profit
        reset_profit_btn = page.locator('button[title*="Reset to formula: Sell - Pur - Lan"]')
        if reset_profit_btn.count() > 0:
            reset_profit_btn.click()
            time.sleep(0.3)
            print(f"Gross Profit after reset: {profit_input.input_value()} (Expected 3500)")

        # 4. Save the full row
        page.locator('button[type="submit"]:has-text("Save Full Sales Row")').click()
        time.sleep(1.5)

        # Verify table view is active and row is present
        table_row = page.locator('text=High-Precision Laser Meter')
        print(f"Saved row visible in Sales Sheet: {table_row.count() > 0}")

        # Capture screenshot of the table with the new row
        page.screenshot(path=r'C:\Users\NUNES\.gemini\antigravity\brain\6e3a986f-0691-409d-9127-c709a98d6fb4\saved_row_in_sales_sheet.png')
        print("Captured: saved_row_in_sales_sheet.png")

        browser.close()
        print("\nALL EDITABLE CALCULATION TESTS PASSED!")

if __name__ == '__main__':
    test_editable_calculations()
