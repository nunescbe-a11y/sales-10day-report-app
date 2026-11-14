import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        
        # Test: Standard Laptop 1366x768
        page = await browser.new_page(viewport={'width': 1366, 'height': 768})
        await page.goto('http://localhost:5173')
        await page.wait_for_timeout(1000)
        
        # Sign in as Naveena
        await page.locator('input[type="email"]').fill('naveena@company.com')
        await page.locator('input[placeholder="••••••••"]').fill('naveena123')
        await page.locator('button[type="submit"]:has-text("Sign In")').click()
        await page.wait_for_timeout(1000)
        
        # Enter workspace
        enter_btn = page.locator('button:has-text("Enter Sales Hub Workspace")')
        if await enter_btn.count() > 0:
            await enter_btn.click()
            await page.wait_for_timeout(800)
            
        # Switch to "Fill New Sale Row" tab
        fill_tab = page.locator('button:has-text("Fill New Sale Row")')
        await fill_tab.click()
        await page.wait_for_timeout(800)
        
        await page.screenshot(path=r'C:\Users\NUNES\.gemini\antigravity\brain\6e3a986f-0691-409d-9127-c709a98d6fb4\page_fit_laptop_1366.png')
        print('Captured page_fit_laptop_1366.png successfully')
        
        await browser.close()

asyncio.run(main())
