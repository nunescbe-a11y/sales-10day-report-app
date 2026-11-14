import asyncio
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page(viewport={'width': 1440, 'height': 900})
        await page.goto('http://localhost:5173', wait_until='networkidle', timeout=30000)
        await asyncio.sleep(2)
        await page.screenshot(path=r'C:\Users\NUNES\.gemini\antigravity\brain\6e3a986f-0691-409d-9127-c709a98d6fb4\race_image_inside_bar_verified.png')
        print('Saved race_image_inside_bar_verified.png')
        await browser.close()

if __name__ == '__main__':
    asyncio.run(run())
