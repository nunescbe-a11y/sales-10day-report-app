import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        context = await browser.new_context(viewport={'width': 1366, 'height': 768})
        page = await context.new_page()
        await page.goto('http://localhost:5173')
        await page.wait_for_timeout(2500)

        # 1. Screenshot of Top Header with Logout button
        await page.screenshot(path='C:/Users/NUNES/.gemini/antigravity/brain/6e3a986f-0691-409d-9127-c709a98d6fb4/logout_button_header.png')
        print('Header with Logout button screenshot taken')

        # 2. Click the Logout button
        logout_btn = page.locator('button[title*="Logout"]')
        if await logout_btn.count() > 0:
            await logout_btn.click()
            await page.wait_for_timeout(1000)
            await page.screenshot(path='C:/Users/NUNES/.gemini/antigravity/brain/6e3a986f-0691-409d-9127-c709a98d6fb4/logout_action_clicked.png')
            print('Logout action clicked screenshot taken')

        await browser.close()

if __name__ == '__main__':
    asyncio.run(main())
