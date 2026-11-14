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

        # 1. Landing Page with Live Clock & Cycle Banner
        print("Capturing 1: Motion Landing Page with Live Clock & 10-Day Cycle...", flush=True)
        await page.screenshot(
            path=r"C:\Users\NUNES\.gemini\antigravity\brain\6e3a986f-0691-409d-9127-c709a98d6fb4\live_clock_landing_page.png",
            full_page=False
        )

        # Scroll down slightly to ensure hero cycle banner is nicely in frame
        await page.evaluate("window.scrollTo(0, 320)")
        await page.wait_for_timeout(1000)
        await page.screenshot(
            path=r"C:\Users\NUNES\.gemini\antigravity\brain\6e3a986f-0691-409d-9127-c709a98d6fb4\live_clock_hero_banner.png",
            full_page=False
        )

        # 2. Log in as Staff (yazhini)
        print("Logging in as Yazhini (Staff)...", flush=True)
        # Scroll down to login form
        await page.evaluate("document.getElementById('portal')?.scrollIntoView() || window.scrollTo(0, 1400)")
        await page.wait_for_timeout(1000)

        # Click Yazhini preset button
        await page.click("button:has-text('Yazhini')")
        await page.wait_for_timeout(500)

        # Uncheck lock computer so we can easily switch users in test
        checkbox = await page.query_selector("input[type='checkbox']")
        if checkbox and await checkbox.is_checked():
            await checkbox.uncheck()

        # Click Sign In
        await page.click("button:has-text('Sign In & Enter Workspace')")
        # Wait for kiss animation and redirect
        await page.wait_for_timeout(3000)

        # Staff Sheet View with Live Countdown Strip
        print("Capturing 2: Staff Sheet with Live Cycle Countdown Strip...", flush=True)
        await page.screenshot(
            path=r"C:\Users\NUNES\.gemini\antigravity\brain\6e3a986f-0691-409d-9127-c709a98d6fb4\live_clock_staff_sheet.png",
            full_page=False
        )

        # 3. Staff Milestone View with Full 4-Box Digital Countdown
        print("Switching to Staff Milestone tab...", flush=True)
        await page.click("button:has-text('My Milestone')")
        await page.wait_for_timeout(1500)
        await page.screenshot(
            path=r"C:\Users\NUNES\.gemini\antigravity\brain\6e3a986f-0691-409d-9127-c709a98d6fb4\live_clock_staff_milestone.png",
            full_page=False
        )

        # 4. Logout and Log in as MD
        print("Logging out and logging in as MD...", flush=True)
        await page.click('button[title="Log out of Cloudflare Session"]')
        await page.wait_for_timeout(2000)

        # Scroll to portal
        await page.evaluate("document.getElementById('portal')?.scrollIntoView() || window.scrollTo(0, 1400)")
        await page.wait_for_timeout(1000)
        
        # Click MD Executive preset button
        await page.click("button:has-text('MD Executive')")
        await page.wait_for_timeout(500)

        # Uncheck lock computer
        checkbox = await page.query_selector("input[type='checkbox']")
        if checkbox and await checkbox.is_checked():
            await checkbox.uncheck()

        await page.click("button:has-text('Sign In & Enter Workspace')")
        await page.wait_for_timeout(3000)

        # MD Analytics View with Live Urgency Strip
        print("Capturing 4: MD Dashboard Analytics with Live Urgency Strip...", flush=True)
        await page.screenshot(
            path=r"C:\Users\NUNES\.gemini\antigravity\brain\6e3a986f-0691-409d-9127-c709a98d6fb4\live_clock_md_analytics.png",
            full_page=False
        )

        # MD 10-Day Cycle Tab
        print("Clicking MD 10-Day Cycle Live Timer tab...", flush=True)
        await page.click("button:has-text('10-Day Cycle Live Timer')")
        await page.wait_for_timeout(1500)
        await page.screenshot(
            path=r"C:\Users\NUNES\.gemini\antigravity\brain\6e3a986f-0691-409d-9127-c709a98d6fb4\live_clock_md_cycle_tab.png",
            full_page=False
        )

        await browser.close()
        print("All live clock & cycle countdown visual verifications captured successfully!", flush=True)

if __name__ == '__main__':
    asyncio.run(main())
