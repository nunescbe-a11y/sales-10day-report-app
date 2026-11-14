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
        await page.wait_for_timeout(3000)

        # 1. Hero Section Screenshot
        print("Capturing 1: Hero Section with Living Portrait & 'Hi, i'm nunes'...", flush=True)
        await page.screenshot(
            path=r"C:\Users\NUNES\.gemini\antigravity\brain\6e3a986f-0691-409d-9127-c709a98d6fb4\3d_portfolio_hero.png",
            full_page=False
        )

        # Move mouse over living portrait to trigger eye follow / wake
        print("Triggering Living Portrait interaction...", flush=True)
        await page.mouse.move(720, 450)
        await page.wait_for_timeout(1000)
        await page.mouse.move(800, 400)
        await page.wait_for_timeout(1000)
        await page.screenshot(
            path=r"C:\Users\NUNES\.gemini\antigravity\brain\6e3a986f-0691-409d-9127-c709a98d6fb4\3d_portfolio_portrait_interaction.png",
            full_page=False
        )

        # 2. Marquee Section Screenshot
        print("Capturing 2: Marquee Section with 21 GIFs...", flush=True)
        await page.evaluate("window.scrollTo(0, 950)")
        await page.wait_for_timeout(1500)
        await page.screenshot(
            path=r"C:\Users\NUNES\.gemini\antigravity\brain\6e3a986f-0691-409d-9127-c709a98d6fb4\3d_portfolio_marquee.png",
            full_page=False
        )

        # 3. About Section Screenshot
        print("Capturing 3: About Section with 4 Corner 3D Elements...", flush=True)
        await page.evaluate("document.getElementById('about')?.scrollIntoView() || window.scrollTo(0, 1850)")
        await page.wait_for_timeout(1500)
        await page.screenshot(
            path=r"C:\Users\NUNES\.gemini\antigravity\brain\6e3a986f-0691-409d-9127-c709a98d6fb4\3d_portfolio_about.png",
            full_page=False
        )

        # 4. Services Section Screenshot
        print("Capturing 4: Services Section (White Background)...", flush=True)
        await page.evaluate("document.getElementById('price')?.scrollIntoView() || window.scrollTo(0, 2750)")
        await page.wait_for_timeout(1500)
        await page.screenshot(
            path=r"C:\Users\NUNES\.gemini\antigravity\brain\6e3a986f-0691-409d-9127-c709a98d6fb4\3d_portfolio_services.png",
            full_page=False
        )

        # 5. Projects Section Screenshot
        print("Capturing 5: Projects Section with Stacking Cards...", flush=True)
        await page.evaluate("document.getElementById('projects')?.scrollIntoView() || window.scrollTo(0, 4200)")
        await page.wait_for_timeout(1500)
        await page.screenshot(
            path=r"C:\Users\NUNES\.gemini\antigravity\brain\6e3a986f-0691-409d-9127-c709a98d6fb4\3d_portfolio_projects.png",
            full_page=False
        )

        # 6. Contact / Portal Modal
        print("Capturing 6: Client & Team Portal Modal on Contact...", flush=True)
        await page.click("button:has-text('Contact Me')")
        await page.wait_for_timeout(1000)
        await page.screenshot(
            path=r"C:\Users\NUNES\.gemini\antigravity\brain\6e3a986f-0691-409d-9127-c709a98d6fb4\3d_portfolio_contact_modal.png",
            full_page=False
        )

        await browser.close()
        print("All 3D portfolio screenshots captured successfully!", flush=True)

if __name__ == '__main__':
    asyncio.run(main())
