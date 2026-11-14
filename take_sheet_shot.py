import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        context = await browser.new_context(viewport={'width': 1366, 'height': 768})
        page = await context.new_page()
        await page.goto('http://localhost:5173')
        await page.wait_for_timeout(2000)

        await page.get_by_role('button', name='Master Sales Sheet').click()
        await page.wait_for_timeout(1000)
        await page.screenshot(path='C:/Users/NUNES/.gemini/antigravity/brain/6e3a986f-0691-409d-9127-c709a98d6fb4/dash_master_sheet_tab_verified.png')
        print('Master sales sheet verified screenshot taken')

        await browser.close()

if __name__ == '__main__':
    asyncio.run(main())
