import time
from playwright.sync_api import sync_playwright

def test_save_and_no_runner():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": 1920, "height": 1080})
        
        print("Navigating to http://localhost:5173...")
        page.goto("http://localhost:5173")
        page.wait_for_load_state("networkidle")
        time.sleep(1)

        # Login as Yazhini if needed
        user_input = page.locator('input[placeholder*="nunes"]')
        if user_input.count() > 0:
            print("Logging in...")
            user_input.fill('yazhini')
            pass_input = page.locator('input[placeholder="••••••••"]')
            pass_input.fill('yazhini123')
            page.locator('button[type="submit"]:has-text("Sign In")').click()
            page.wait_for_load_state("networkidle")
            time.sleep(1.5)

        # Switch to "Fill New Sale Row" tab
        fill_tab = page.locator('button:has-text("Fill New Sale Row")')
        fill_tab.click()
        time.sleep(1)

        # Check the button text: should be simply "Save"
        save_btn = page.locator('button[type="submit"]:has-text("Save")')
        btn_text = save_btn.inner_text().strip()
        print(f"Submit button inner text: '{btn_text}'")
        assert "Trigger Runner" not in btn_text, "Trigger Runner text should not be present!"
        assert btn_text == "Save", f"Expected 'Save', got '{btn_text}'"

        # Capture screenshot showing the clean Save button
        page.screenshot(path=r"C:\Users\NUNES\.gemini\antigravity\brain\6e3a986f-0691-409d-9127-c709a98d6fb4\save_button_simplified.png")
        print("Captured: save_button_simplified.png")

        # Now fill minimal required fields and click Save to ensure NO runner animation appears
        page.locator('input[placeholder*="silicon trowel scraper"]').fill("Clean Save Test Item")
        page.locator('input[placeholder*="handy home solution"]').fill("Clean Client Corp")
        
        # Selling cost
        page.locator('input[placeholder="0"]').nth(2).fill("12000")
        
        # Click Save
        save_btn.click()
        time.sleep(1)

        # Verify no runner SVG or CONGRATS speech bubble is in DOM
        runner_elements = page.locator('text="CONGRATS!"')
        print(f"Runner speech bubble present: {runner_elements.count() > 0}")
        assert runner_elements.count() == 0, "Runner animation should be completely gone!"

        page.screenshot(path=r"C:\Users\NUNES\.gemini\antigravity\brain\6e3a986f-0691-409d-9127-c709a98d6fb4\saved_without_runner.png")
        print("Captured: saved_without_runner.png")

        browser.close()
        print("[SUCCESS] Verified: Button is simply 'Save' and Runner animation is completely removed!")

if __name__ == '__main__':
    test_save_and_no_runner()
