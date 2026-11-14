import asyncio
import os
from playwright.async_api import async_playwright

CLOUDFLARE_URL = "https://issue-provincial-searched-mozilla.trycloudflare.com"
ARTIFACTS_DIR = r"C:\Users\NUNES\.gemini\antigravity\brain\6e3a986f-0691-409d-9127-c709a98d6fb4"

async def test_workspaces():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        
        # 1. Staff View (Yazhini)
        context1 = await browser.new_context(viewport={"width": 1440, "height": 900})
        page1 = await context1.new_page()
        await page1.goto(CLOUDFLARE_URL, timeout=30000, wait_until="networkidle")
        await page1.locator("#login-terminal-section").scroll_into_view_if_needed()
        await page1.locator("button:has-text('Yazhini')").first.click()
        await page1.locator("button:has-text('Sign In & Enter Workspace')").first.click()
        await page1.wait_for_timeout(2000)

        # Click Fill New Sale Row
        await page1.locator("button:has-text('Fill New Sale Row')").click()
        await page1.wait_for_timeout(600)
        await page1.screenshot(path=os.path.join(ARTIFACTS_DIR, "cloudflare_live_staff_fill_form.png"))
        print("Captured cloudflare_live_staff_fill_form.png")

        # 2. MD View (Director)
        context2 = await browser.new_context(viewport={"width": 1440, "height": 900})
        page2 = await context2.new_page()
        await page2.goto(CLOUDFLARE_URL, timeout=30000, wait_until="networkidle")
        await page2.locator("#login-terminal-section").scroll_into_view_if_needed()
        await page2.locator("button:has-text('MD')").first.click()
        await page2.locator("button:has-text('Sign In & Enter Workspace')").first.click()
        await page2.wait_for_timeout(2000)
        await page2.screenshot(path=os.path.join(ARTIFACTS_DIR, "cloudflare_live_md_master_dashboard.png"))
        print("Captured cloudflare_live_md_master_dashboard.png")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(test_workspaces())
