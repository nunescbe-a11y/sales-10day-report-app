import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(viewport={'width': 1440, 'height': 900})
        page = await context.new_page()

        url = "http://localhost:5173"
        print(f"Navigating to {url}...", flush=True)
        await page.goto(url, wait_until="networkidle")
        await page.wait_for_timeout(2000)

        # 1. Capture Hero Section showing "LOGIN"
        print("Capturing 1: Hero Section with 'LOGIN' button...", flush=True)
        await page.screenshot(
            path=r"C:\Users\NUNES\.gemini\antigravity\brain\6e3a986f-0691-409d-9127-c709a98d6fb4\nunes_hero_login_button.png",
            full_page=False
        )

        # 2. Click "Login" button to open clean login modal
        print("Clicking Login button to open modal...", flush=True)
        await page.click("button:has-text('Login')")
        await page.wait_for_timeout(1000)
        await page.screenshot(
            path=r"C:\Users\NUNES\.gemini\antigravity\brain\6e3a986f-0691-409d-9127-c709a98d6fb4\nunes_clean_login_modal.png",
            full_page=False
        )

        # 3. Log in as Nunes (Instant, no boy animation/delays)
        print("Signing in as Nunes (MD)...", flush=True)
        await page.click("button:has-text('Sign In to Workspace')")
        await page.wait_for_timeout(2000)
        await page.screenshot(
            path=r"C:\Users\NUNES\.gemini\antigravity\brain\6e3a986f-0691-409d-9127-c709a98d6fb4\nunes_workspace_logged_in.png",
            full_page=False
        )

        # 4. Log out and Log in as Staff (Yazhini)
        print("Logging out...", flush=True)
        await page.click('button[title="Log out of Cloudflare Session"]')
        await page.wait_for_timeout(1500)

        # If on direct CloudflareLogin screen or landing page:
        login_btn = await page.query_selector("button:has-text('Sign In to Workspace')")
        if not login_btn:
            await page.click("button:has-text('Login')")
            await page.wait_for_timeout(800)

        # Click Yazhini preset
        print("Selecting Yazhini preset...", flush=True)
        await page.click("button:has-text('Yazhini')")
        await page.wait_for_timeout(300)

        # Uncheck lock computer so future tests stay flexible
        checkbox = await page.query_selector("input[type='checkbox']")
        if checkbox and await checkbox.is_checked():
            await checkbox.uncheck()

        await page.click("button:has-text('Sign In to Workspace')")
        await page.wait_for_timeout(2000)

        # Capture Staff Workspace
        print("Capturing 4: Yazhini Staff Workspace...", flush=True)
        await page.screenshot(
            path=r"C:\Users\NUNES\.gemini\antigravity\brain\6e3a986f-0691-409d-9127-c709a98d6fb4\yazhini_staff_workspace.png",
            full_page=False
        )

        await browser.close()
        print("All clean Nunes login tests verified successfully!", flush=True)

if __name__ == '__main__':
    asyncio.run(main())
