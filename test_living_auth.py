import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page(viewport={'width': 1366, 'height': 820})
        
        # 1. Open the Sign In & Sign Up Page
        await page.goto('http://localhost:5173')
        await page.wait_for_timeout(2000)
        await page.screenshot(path=r'C:\Users\NUNES\.gemini\antigravity\brain\6e3a986f-0691-409d-9127-c709a98d6fb4\living_auth_split_desktop.png')
        print('1. Captured living_auth_split_desktop.png')
        
        # 2. Focus in password input -> character closes eyes (no peeking)
        password_input = page.locator('input[placeholder="••••••••"]')
        await password_input.focus()
        await page.wait_for_timeout(700)
        await page.screenshot(path=r'C:\Users\NUNES\.gemini\antigravity\brain\6e3a986f-0691-409d-9127-c709a98d6fb4\living_auth_password_eyes_closed.png')
        print('2. Captured living_auth_password_eyes_closed.png')
        
        # 3. Click show password (eye icon) -> character peeks with a wink
        peek_btn = page.locator('button[title="Peek password"]')
        if await peek_btn.count() > 0:
            await peek_btn.click()
            await page.wait_for_timeout(400)
            await page.screenshot(path=r'C:\Users\NUNES\.gemini\antigravity\brain\6e3a986f-0691-409d-9127-c709a98d6fb4\living_auth_peek_wink.png')
            print('3. Captured living_auth_peek_wink.png')
            
        # 4. Fill wrong credentials -> submit -> error pout (puff cheeks) and card shake
        await page.locator('input[type="email"]').fill('unknown@company.com')
        await password_input.fill('wrongpass999')
        await page.locator('button[type="submit"]:has-text("Sign In")').click()
        await page.wait_for_timeout(800)
        await page.screenshot(path=r'C:\Users\NUNES\.gemini\antigravity\brain\6e3a986f-0691-409d-9127-c709a98d6fb4\living_auth_error_pout_shake.png')
        print('4. Captured living_auth_error_pout_shake.png')
        
        # 5. Switch to Sign Up tab
        await page.locator('button[type="button"]:has-text("Sign Up")').click()
        await page.wait_for_timeout(600)
        await page.screenshot(path=r'C:\Users\NUNES\.gemini\antigravity\brain\6e3a986f-0691-409d-9127-c709a98d6fb4\living_auth_signup_tab.png')
        print('5. Captured living_auth_signup_tab.png')
        
        # 6. Switch back to Sign In tab and submit valid credentials (nunes / nunes123)
        await page.locator('button[type="button"]:has-text("Sign In")').click()
        await page.wait_for_timeout(400)
        await page.locator('input[type="email"]').fill('nunes@company.com')
        await page.locator('input[placeholder="••••••••"]').fill('nunes123')
        await page.locator('button[type="submit"]:has-text("Sign In")').click()
        await page.wait_for_timeout(1000)
        
        # 7. Captured Authenticated State (Heart eyes & Welcome card)
        await page.screenshot(path=r'C:\Users\NUNES\.gemini\antigravity\brain\6e3a986f-0691-409d-9127-c709a98d6fb4\living_auth_authenticated_card.png')
        print('6. Captured living_auth_authenticated_card.png')
        
        # 8. Enter Sales Hub Workspace
        enter_btn = page.locator('button:has-text("Enter Sales Hub Workspace")')
        if await enter_btn.count() > 0:
            await enter_btn.click()
            await page.wait_for_timeout(1000)
            await page.screenshot(path=r'C:\Users\NUNES\.gemini\antigravity\brain\6e3a986f-0691-409d-9127-c709a98d6fb4\workspace_after_living_auth.png')
            print('7. Captured workspace_after_living_auth.png')
        
        # 9. Test Mobile Stacked Viewport
        mobile_page = await browser.new_page(viewport={'width': 390, 'height': 844})
        await mobile_page.goto('http://localhost:5173')
        await mobile_page.wait_for_timeout(1500)
        await mobile_page.screenshot(path=r'C:\Users\NUNES\.gemini\antigravity\brain\6e3a986f-0691-409d-9127-c709a98d6fb4\living_auth_mobile_stacked.png')
        print('8. Captured living_auth_mobile_stacked.png')
        
        await browser.close()
        print('ALL TESTS COMPLETED SUCCESSFULLY!')

asyncio.run(main())
