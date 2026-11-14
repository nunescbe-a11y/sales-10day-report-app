import asyncio
import os
from playwright.async_api import async_playwright

ARTIFACT_DIR = r"C:\Users\NUNES\.gemini\antigravity\brain\6e3a986f-0691-409d-9127-c709a98d6fb4"

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page(viewport={'width': 1440, 'height': 900})
        
        # 1. Tab 1: Race & Executive Dashboard (White Theme)
        await page.goto('http://localhost:5173', wait_until='networkidle', timeout=30000)
        await asyncio.sleep(2)
        p1 = os.path.join(ARTIFACT_DIR, 'white_theme_dashboard_race.png')
        await page.screenshot(path=p1)
        print(f"Saved {p1}")

        # 2. Tab 2: Master Sales Sheet (White Theme)
        sheet_btn = page.locator("button:has-text('Master Sales Sheet')").first
        if await sheet_btn.count() > 0:
            await sheet_btn.click()
            await asyncio.sleep(1.5)
            p2 = os.path.join(ARTIFACT_DIR, 'white_theme_master_sheet.png')
            await page.screenshot(path=p2)
            print(f"Saved {p2}")

        await browser.close()

if __name__ == '__main__':
    asyncio.run(run())
