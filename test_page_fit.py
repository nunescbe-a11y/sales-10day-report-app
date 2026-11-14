import time
from playwright.sync_api import sync_playwright

def test_page_fit():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Match user's exact screen resolution from the screenshot
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

        # Log in as Yazhini S. (like user's screenshot)
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

        # Take full viewport screenshot
        page.screenshot(path=r'C:\Users\NUNES\.gemini\antigravity\brain\6e3a986f-0691-409d-9127-c709a98d6fb4\page_fit_yazhini_1920x828.png')
        print("Captured: page_fit_yazhini_1920x828.png")

        # Check laptop resolution 1366x768
        page.set_viewport_size({'width': 1366, 'height': 768})
        time.sleep(0.5)
        page.screenshot(path=r'C:\Users\NUNES\.gemini\antigravity\brain\6e3a986f-0691-409d-9127-c709a98d6fb4\page_fit_yazhini_1366x768.png')
        print("Captured: page_fit_yazhini_1366x768.png")

        browser.close()

if __name__ == '__main__':
    test_page_fit()
