import asyncio
from playwright.async_api import async_playwright

async def inspect():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        pg = await b.new_page()
        await pg.goto("https://issue-provincial-searched-mozilla.trycloudflare.com", timeout=30000)
        await pg.wait_for_timeout(2000)
        print("TITLE:", await pg.title())
        print("URL:", pg.url)
        print("COUNT #playground:", await pg.locator("#playground").count())
        print("COUNT #login-terminal-section:", await pg.locator("#login-terminal-section").count())
        text = await pg.inner_text("body")
        print("BODY (first 300 chars):", text[:300])
        await b.close()

if __name__ == "__main__":
    asyncio.run(inspect())
