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

        # 1. Hero
        print("Capturing 1: Hero Section...", flush=True)
        await page.screenshot(
            path=r"C:\Users\NUNES\.gemini\antigravity\brain\6e3a986f-0691-409d-9127-c709a98d6fb4\clean_flow_hero.png",
            full_page=False
        )

        # 2. Scroll directly to About section (No slide animation section!)
        print("Capturing 2: Seamless transition directly into About Me (Slide animation removed)...", flush=True)
        await page.evaluate("window.scrollTo(0, 850)")
        await page.wait_for_timeout(1500)
        await page.screenshot(
            path=r"C:\Users\NUNES\.gemini\antigravity\brain\6e3a986f-0691-409d-9127-c709a98d6fb4\clean_flow_about.png",
            full_page=False
        )

        # 3. Services
        print("Capturing 3: Services Section...", flush=True)
        await page.evaluate("document.getElementById('price')?.scrollIntoView() || window.scrollTo(0, 1800)")
        await page.wait_for_timeout(1500)
        await page.screenshot(
            path=r"C:\Users\NUNES\.gemini\antigravity\brain\6e3a986f-0691-409d-9127-c709a98d6fb4\clean_flow_services.png",
            full_page=False
        )

        # 4. Projects
        print("Capturing 4: Projects Section...", flush=True)
        await page.evaluate("document.getElementById('projects')?.scrollIntoView() || window.scrollTo(0, 3200)")
        await page.wait_for_timeout(1500)
        await page.screenshot(
            path=r"C:\Users\NUNES\.gemini\antigravity\brain\6e3a986f-0691-409d-9127-c709a98d6fb4\clean_flow_projects.png",
            full_page=False
        )

        await browser.close()
        print("Verification without slide animation complete!", flush=True)

if __name__ == '__main__':
    asyncio.run(main())
