import asyncio
import os
from playwright.async_api import async_playwright

ARTIFACT_DIR = r"C:\Users\NUNES\.gemini\antigravity\brain\6e3a986f-0691-409d-9127-c709a98d6fb4"

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(viewport={"width": 1440, "height": 900})
        page = await context.new_page()

        print("Navigating to http://localhost:5173...")
        await page.goto("http://localhost:5173", wait_until="networkidle", timeout=30000)
        await asyncio.sleep(2)

        # 1. Race & Leaderboard Tab
        race_path = os.path.join(ARTIFACT_DIR, "universal_staff_photos_race_tab.png")
        await page.screenshot(path=race_path)
        print(f"Captured: {race_path}")

        # 2. Tab 2: Master Sales Sheet
        master_btn = page.locator("button:has-text('Master Sales Sheet')").first
        if await master_btn.count() > 0:
            await master_btn.click()
            await asyncio.sleep(1.5)
            master_path = os.path.join(ARTIFACT_DIR, "universal_staff_photos_master_sheet.png")
            await page.screenshot(path=master_path)
            print(f"Captured: {master_path}")

        # 3. Add Row Modal (click Add Row while in Master Sales Sheet)
        add_btn = page.locator("button:has-text('Add Row')").first
        if await add_btn.count() > 0:
            await add_btn.click()
            await asyncio.sleep(1.2)
            add_modal_path = os.path.join(ARTIFACT_DIR, "universal_staff_photos_add_modal.png")
            await page.screenshot(path=add_modal_path)
            print(f"Captured: {add_modal_path}")

            # Close modal with close button or Escape
            await page.keyboard.press("Escape")
            await asyncio.sleep(0.8)

        # 4. Tab 4: Staff Oversight Hub
        # Find 4th tab button in the sub-header
        tabs = page.locator("div.bg-slate-900.border-slate-800 button")
        if await tabs.count() >= 4:
            await tabs.nth(3).click()
            await asyncio.sleep(1.5)
            oversight_path = os.path.join(ARTIFACT_DIR, "universal_staff_photos_oversight_tab.png")
            await page.screenshot(path=oversight_path)
            print(f"Captured: {oversight_path}")

        # 5. Logout / Staff Login Modal
        logout_btn = page.locator("button[title*='Logout']").first
        if await logout_btn.count() > 0:
            await logout_btn.click()
            await asyncio.sleep(1.2)
            login_modal_path = os.path.join(ARTIFACT_DIR, "universal_staff_photos_login_modal.png")
            await page.screenshot(path=login_modal_path)
            print(f"Captured: {login_modal_path}")

        await browser.close()
        print("All screenshots captured successfully.")

if __name__ == "__main__":
    asyncio.run(main())
