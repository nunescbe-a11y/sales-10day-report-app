import asyncio
import os
from playwright.async_api import async_playwright

CLOUDFLARE_URL = "https://issue-provincial-searched-mozilla.trycloudflare.com"
ARTIFACTS_DIR = r"C:\Users\NUNES\.gemini\antigravity\brain\6e3a986f-0691-409d-9127-c709a98d6fb4"

async def test_cloudflare():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(viewport={"width": 1440, "height": 900})
        page = await context.new_page()

        print(f"Navigating to Cloudflare Live URL: {CLOUDFLARE_URL}")
        await page.goto(CLOUDFLARE_URL, timeout=30000, wait_until="domcontentloaded")
        await page.evaluate("() => localStorage.clear()")
        await page.reload(wait_until="networkidle")
        await page.wait_for_timeout(1500)

        # 1. Capture Hero Section on Landing Page
        await page.screenshot(path=os.path.join(ARTIFACTS_DIR, "cloudflare_live_hero.png"))
        print("Captured cloudflare_live_hero.png")

        # 2. Scroll to 10-Day Cycle Architecture & Formula Playground
        playground = page.locator("#playground")
        if await playground.count() > 0:
            await playground.scroll_into_view_if_needed()
            await page.wait_for_timeout(800)
            await page.screenshot(path=os.path.join(ARTIFACTS_DIR, "cloudflare_live_playground.png"))
            print("Captured cloudflare_live_playground.png")

        # 3. Scroll to 3D Companion Test Bench
        companion = page.locator("#companion")
        if await companion.count() > 0:
            await companion.scroll_into_view_if_needed()
            await page.wait_for_timeout(600)
            
            # Click "Test Kiss (Correct)" button
            kiss_btn = page.locator("button:has-text('Test Kiss (Correct)')")
            if await kiss_btn.count() > 0:
                await kiss_btn.click()
                await page.wait_for_timeout(600)
                await page.screenshot(path=os.path.join(ARTIFACTS_DIR, "cloudflare_live_companion_kiss.png"))
                print("Captured cloudflare_live_companion_kiss.png")

            # Click "Test Celebration Runner" button
            runner_btn = page.locator("button:has-text('Test Celebration Runner')")
            if await runner_btn.count() > 0:
                await runner_btn.click()
                await page.wait_for_timeout(600)
                await page.screenshot(path=os.path.join(ARTIFACTS_DIR, "cloudflare_live_companion_runner.png"))
                print("Captured cloudflare_live_companion_runner.png")

        # 4. Scroll to Direct Cloudflare Access Terminal
        terminal = page.locator("#login-terminal-section")
        if await terminal.count() > 0:
            await terminal.scroll_into_view_if_needed()
            await page.wait_for_timeout(600)
            await page.screenshot(path=os.path.join(ARTIFACTS_DIR, "cloudflare_live_terminal.png"))
            print("Captured cloudflare_live_terminal.png")

            # Sign in via Yazhini preset
            yazhini_btn = page.locator("button:has-text('Yazhini')")
            if await yazhini_btn.count() > 0:
                await yazhini_btn.first.click()
                await page.wait_for_timeout(300)

            sign_in_btn = page.locator("button:has-text('Sign In & Enter Workspace')")
            if await sign_in_btn.count() > 0:
                await sign_in_btn.first.click()
                print("Clicked sign in, waiting for 3D kiss animation & workspace transition...")
                await page.wait_for_timeout(2500)
                await page.screenshot(path=os.path.join(ARTIFACTS_DIR, "cloudflare_live_authenticated_workspace.png"))
                print("Captured cloudflare_live_authenticated_workspace.png")

                # Switch to Quick Fill Form and check custom status button & cost labels
                fill_tab = page.locator("button:has-text('Quick Fill Form')")
                if await fill_tab.count() > 0:
                    await fill_tab.click()
                    await page.wait_for_timeout(600)
                    await page.screenshot(path=os.path.join(ARTIFACTS_DIR, "cloudflare_live_fill_form.png"))
                    print("Captured cloudflare_live_fill_form.png")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(test_cloudflare())
