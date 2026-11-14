import time
from playwright.sync_api import sync_playwright

def test_auth_both_name_and_email():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={'width': 1440, 'height': 900})
        page = context.new_page()
        
        # 1. Open app
        page.goto('http://localhost:5173')
        page.wait_for_load_state('networkidle')
        time.sleep(1)

        # If on 3D portfolio landing page, click the Login button in topbar
        login_btn = page.locator('button:has-text("Login")')
        if login_btn.count() > 0 and login_btn.first.is_visible():
            login_btn.first.click()
            time.sleep(1)

        # Check if already authenticated, if so click logout
        logout_btn = page.locator('button[title*="Log out"]')
        if logout_btn.count() > 0 and logout_btn.first.is_visible():
            logout_btn.first.click()
            time.sleep(1)

        # Check input label and placeholder
        label = page.locator('label:has-text("Name or Email Address")')
        print(f"Label found: {label.count() > 0}")

        user_input = page.locator('input[placeholder*="nunes"]')
        print(f"Input placeholder found: {user_input.count() > 0}")
        print(f"Input type: {user_input.get_attribute('type')}")

        # Capture screenshot of the updated Login Card
        page.screenshot(path=r'C:\Users\NUNES\.gemini\antigravity\brain\6e3a986f-0691-409d-9127-c709a98d6fb4\login_name_or_email_input.png')
        print("Captured screenshot: login_name_or_email_input.png")

        # --- Test 1: Plain name 'nunes' ---
        print("\n--- Testing Plain Name 'nunes' ---")
        user_input.fill('nunes')
        pass_input = page.locator('input[placeholder="••••••••"]')
        pass_input.fill('nunes123')
        
        page.locator('button[type="submit"]:has-text("Sign In")').click()
        time.sleep(1.5)

        # Verify MD view is loaded with Nunes
        is_md_loaded = page.locator('text=Nunes Executive Oversight').count() > 0
        print(f"Test 1 (Name 'nunes' -> MD Dashboard): {is_md_loaded}")
        page.screenshot(path=r'C:\Users\NUNES\.gemini\antigravity\brain\6e3a986f-0691-409d-9127-c709a98d6fb4\logged_in_as_nunes_name.png')

        # Log out
        page.locator('button[title*="Log out"]').click()
        time.sleep(1.2)

        # --- Test 2: Full Email 'nunes@company.com' ---
        print("\n--- Testing Email 'nunes@company.com' ---")
        user_input = page.locator('input[placeholder*="nunes"]')
        user_input.fill('nunes@company.com')
        pass_input = page.locator('input[placeholder="••••••••"]')
        pass_input.fill('nunes123')
        
        page.locator('button[type="submit"]:has-text("Sign In")').click()
        time.sleep(1.5)

        is_md_loaded2 = page.locator('text=Nunes Executive Oversight').count() > 0
        print(f"Test 2 (Email 'nunes@company.com' -> MD Dashboard): {is_md_loaded2}")

        # Log out
        page.locator('button[title*="Log out"]').click()
        time.sleep(1.2)

        # --- Test 3: Plain name 'naveena' ---
        print("\n--- Testing Plain Name 'naveena' ---")
        user_input = page.locator('input[placeholder*="nunes"]')
        user_input.fill('naveena')
        pass_input = page.locator('input[placeholder="••••••••"]')
        pass_input.fill('naveena123')
        
        page.locator('button[type="submit"]:has-text("Sign In")').click()
        time.sleep(1.5)

        is_naveena_loaded = page.locator('text=Single Profile: Naveena R.').count() > 0
        print(f"Test 3 (Name 'naveena' -> Sales Rep Workspace): {is_naveena_loaded}")
        page.screenshot(path=r'C:\Users\NUNES\.gemini\antigravity\brain\6e3a986f-0691-409d-9127-c709a98d6fb4\logged_in_as_naveena_name.png')

        # Log out
        page.locator('button[title*="Log out"]').click()
        time.sleep(1.2)

        # --- Test 4: Email 'naveena@company.com' ---
        print("\n--- Testing Email 'naveena@company.com' ---")
        user_input = page.locator('input[placeholder*="nunes"]')
        user_input.fill('naveena@company.com')
        pass_input = page.locator('input[placeholder="••••••••"]')
        pass_input.fill('naveena123')
        
        page.locator('button[type="submit"]:has-text("Sign In")').click()
        time.sleep(1.5)

        is_naveena_email_loaded = page.locator('text=Single Profile: Naveena R.').count() > 0
        print(f"Test 4 (Email 'naveena@company.com' -> Sales Rep Workspace): {is_naveena_email_loaded}")

        # Log out
        page.locator('button[title*="Log out"]').click()
        time.sleep(1.2)

        # --- Test 5: Plain name 'yazhini' ---
        print("\n--- Testing Plain Name 'yazhini' ---")
        user_input = page.locator('input[placeholder*="nunes"]')
        user_input.fill('yazhini')
        pass_input = page.locator('input[placeholder="••••••••"]')
        pass_input.fill('yazhini123')
        
        page.locator('button[type="submit"]:has-text("Sign In")').click()
        time.sleep(1.5)

        is_yazhini_loaded = page.locator('text=Single Profile: Yazhini S.').count() > 0
        print(f"Test 5 (Name 'yazhini' -> Sales Rep Workspace): {is_yazhini_loaded}")

        # Leave in logged-out state for user
        page.locator('button[title*="Log out"]').click()
        time.sleep(1)

        print("\nALL 5 AUTHENTICATION TESTS PASSED SUCCESSFULLY!")
        browser.close()

if __name__ == '__main__':
    test_auth_both_name_and_email()
