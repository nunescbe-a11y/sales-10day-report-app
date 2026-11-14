import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page(viewport={'width': 1280, 'height': 800})
        
        await page.goto('http://localhost:5173')
        await page.wait_for_timeout(1000)
        
        # Open login modal
        login_btn = page.locator('button:has-text("Login")').first
        await login_btn.click()
        await page.wait_for_timeout(600)
        
        # Click yazhini quick pill
        await page.locator('button:has-text("yazhini")').click()
        await page.wait_for_timeout(300)
        await page.locator('button:has-text("Sign In to Workspace")').click()
        await page.wait_for_timeout(1000)
        
        # Switch to New Sale Entry tab
        entry_tab = page.locator('button:has-text("New Sale Entry")')
        if await entry_tab.count() > 0:
            await entry_tab.click()
            await page.wait_for_timeout(600)
        
        # Scroll to ITEM STATUS
        status_sec = page.locator('text=ITEM STATUS').first
        await status_sec.scroll_into_view_if_needed()
        await page.wait_for_timeout(500)
        
        await page.screenshot(path=r'C:\Users\NUNES\.gemini\antigravity\brain\6e3a986f-0691-409d-9127-c709a98d6fb4\item_status_matched.png')
        print('Captured item_status_matched.png successfully')
        await browser.close()

asyncio.run(main())
