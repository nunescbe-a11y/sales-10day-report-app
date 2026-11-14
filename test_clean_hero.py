import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page(viewport={'width': 1280, 'height': 800})
        
        await page.goto('http://localhost:5173')
        await page.wait_for_timeout(2000)
        
        # Take screenshot of clean Hero with unobstructed 3D Portrait
        await page.screenshot(path=r'C:\Users\NUNES\.gemini\antigravity\brain\6e3a986f-0691-409d-9127-c709a98d6fb4\clean_hero_no_text.png')
        print('Captured clean_hero_no_text.png successfully')
        
        await browser.close()

asyncio.run(main())
