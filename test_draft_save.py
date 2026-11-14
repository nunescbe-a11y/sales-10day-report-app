import asyncio
import os
from playwright.async_api import async_playwright

CLOUDFLARE_URL = "https://issue-provincial-searched-mozilla.trycloudflare.com"
ARTIFACTS_DIR = r"C:\Users\NUNES\.gemini\antigravity\brain\6e3a986f-0691-409d-9127-c709a98d6fb4"

async def test_draft_workflow():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(viewport={"width": 1440, "height": 900})
        page = await context.new_page()

        print(f"Connecting to Cloudflare Live URL: {CLOUDFLARE_URL}")
        await page.goto(CLOUDFLARE_URL, timeout=30000, wait_until="networkidle")
        
        # Scroll to terminal and login as Yazhini
        terminal = page.locator("#login-terminal-section")
        await terminal.scroll_into_view_if_needed()
        await page.locator("button:has-text('Yazhini')").first.click()
        await page.locator("button:has-text('Sign In & Enter Workspace')").first.click()
        await page.wait_for_timeout(2000)

        # 1. Switch to Fill New Sale Row Tab
        print("Navigating to Fill New Sale Row tab...")
        await page.locator("button:has-text('Fill New Sale Row')").click()
        await page.wait_for_timeout(600)

        # Fill only HALF the form:
        print("Entering partial / half-filled data...")
        item_input = page.locator("input[placeholder*='silicon trowel']")
        await item_input.fill("Digital Multimeter 6.5 Digit (Half Filled)")

        com_input = page.locator("input[placeholder*='handy home solution']")
        await com_input.fill("Omron Electronic Components Ltd")

        # Set purchase cost only, leaving sellCost and advance empty
        pur_input = page.locator("input[placeholder='0']").first
        await pur_input.fill("18000")

        await page.wait_for_timeout(600)
        await page.screenshot(path=os.path.join(ARTIFACTS_DIR, "draft_half_filled_form.png"))
        print("Captured draft_half_filled_form.png")

        # 2. Click "Save in Half (Save as Draft)" button
        print("Clicking 'Save in Half (Save as Draft)' button...")
        draft_btn = page.locator("button:has-text('Save in Half (Save as Draft)')")
        await draft_btn.click()
        await page.wait_for_timeout(1000)

        # 3. Verify in Sheet Tab
        await page.screenshot(path=os.path.join(ARTIFACTS_DIR, "draft_saved_in_sheet.png"))
        print("Captured draft_saved_in_sheet.png")

        # 4. Click "Reopen & Edit" on the draft row
        print("Clicking 'Reopen & Edit' on the draft row...")
        reopen_btn = page.locator("button:has-text('Reopen & Edit')").first
        if await reopen_btn.count() > 0:
            await reopen_btn.click()
            await page.wait_for_timeout(800)
            await page.screenshot(path=os.path.join(ARTIFACTS_DIR, "draft_reopened_edit_banner.png"))
            print("Captured draft_reopened_edit_banner.png")

            # 5. Complete the form and finish
            print("Completing remaining fields (Selling Price)...")
            sell_input = page.locator("input[placeholder='0']").nth(2)
            await sell_input.fill("34000")

            advance_input = page.locator("input[placeholder='0']").nth(3)
            await advance_input.fill("15000")

            # Click Complete & Save Row
            complete_btn = page.locator("button:has-text('Complete & Save Row')")
            if await complete_btn.count() > 0:
                await complete_btn.click()
                print("Clicked Complete & Save Row! Waiting for runner...")
                await page.wait_for_timeout(1200)
                await page.screenshot(path=os.path.join(ARTIFACTS_DIR, "draft_completed_runner.png"))
                print("Captured draft_completed_runner.png")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(test_draft_workflow())
