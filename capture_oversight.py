import asyncio
import os
from playwright.async_api import async_playwright

ARTIFACT_DIR = r"C:\Users\NUNES\.gemini\antigravity\brain\6e3a986f-0691-409d-9127-c709a98d6fb4"

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page(viewport={"width": 1440, "height": 900})

        await page.goto("http://localhost:5173", wait_until="networkidle", timeout=30000)
        await asyncio.sleep(2)

        # Click the 4th tab (Staff Oversight Hub)
        tabs = page.locator("div.bg-slate-900.border-slate-800 button")
        await tabs.nth(3).click()
        await asyncio.sleep(2)

        oversight_path = os.path.join(ARTIFACT_DIR, "universal_staff_photos_oversight_tab.png")
        await page.screenshot(path=oversight_path)
        print(f"Captured: {oversight_path}")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
