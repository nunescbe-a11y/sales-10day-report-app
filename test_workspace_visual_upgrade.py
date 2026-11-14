import time
from playwright.sync_api import sync_playwright

def test_workspace_visuals():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Standard 1920x1080 display
        page = browser.new_page(viewport={"width": 1920, "height": 1080})
        
        print("Navigating to http://localhost:5173...")
        page.goto("http://localhost:5173")
        page.wait_for_load_state("networkidle")
        time.sleep(1)

        # Login as Yazhini if login page is showing
        user_input = page.locator('input[placeholder*="nunes"]')
        if user_input.count() > 0:
            print("Logging in as Yazhini S...")
            user_input.fill('yazhini')
            pass_input = page.locator('input[placeholder="••••••••"]')
            pass_input.fill('yazhini123')
            page.locator('button[type="submit"]:has-text("Sign In")').click()
            page.wait_for_load_state("networkidle")
            time.sleep(1.5)

        # Ensure we are on Dark Theme initially
        theme_btn = page.locator('header button[title*="Theme"]')
        print(f"Theme button found: {theme_btn.count() > 0}")

        # Capture Workspace in Dark Theme (Tab: Sheet)
        page.screenshot(path=r"C:\Users\NUNES\.gemini\antigravity\brain\6e3a986f-0691-409d-9127-c709a98d6fb4\workspace_sheet_dark.png")
        print("Captured: workspace_sheet_dark.png")

        # Switch to "Fill New Sale Row" tab
        fill_tab = page.locator('button:has-text("Fill New Sale Row")')
        if fill_tab.count() > 0:
            fill_tab.click()
            time.sleep(0.8)

        # Capture the redesigned, easy-on-the-eyes form in Dark Mode
        page.screenshot(path=r"C:\Users\NUNES\.gemini\antigravity\brain\6e3a986f-0691-409d-9127-c709a98d6fb4\workspace_form_dark.png")
        print("Captured: workspace_form_dark.png")

        # Now test toggling to Light Mode!
        theme_btn.click()
        time.sleep(0.8)

        # Capture the redesigned form in Light Mode
        page.screenshot(path=r"C:\Users\NUNES\.gemini\antigravity\brain\6e3a986f-0691-409d-9127-c709a98d6fb4\workspace_form_light.png")
        print("Captured: workspace_form_light.png")

        # Switch back to Dark Mode (default preference)
        theme_btn.click()
        time.sleep(0.5)

        browser.close()
        print("[SUCCESS] All workspace visual verification tests completed!")

if __name__ == '__main__':
    test_workspace_visuals()
