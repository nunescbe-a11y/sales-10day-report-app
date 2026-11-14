import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
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
            
        # Take screenshot of clean topbar
        header_el = page.locator('header')
        await header_el.screenshot(path=r'C:\Users\NUNES\.gemini\antigravity\brain\6e3a986f-0691-409d-9127-c709a98d6fb4\clean_topbar_only.png')
        print('Captured clean_topbar_only.png')
        
        # Take full screen screenshot
        await page.screenshot(path=r'C:\Users\NUNES\.gemini\antigravity\brain\6e3a986f-0691-409d-9127-c709a98d6fb4\topbar_clean_no_three_items.png')
        print('Captured topbar_clean_no_three_items.png successfully')
        
        # Switch to "Fill New Sale Row" tab to show full page fit with clean header
        await page.locator('button:has-text("Fill New Sale Row")').click()
        await page.wait_for_timeout(600)
        await page.screenshot(path=r'C:\Users\NUNES\.gemini\antigravity\brain\6e3a986f-0691-409d-9127-c709a98d6fb4\clean_topbar_with_fill_form.png')
        print('Captured clean_topbar_with_fill_form.png successfully')
        
        await browser.close()
        print('TEST COMPLETED!')

asyncio.run(main())
