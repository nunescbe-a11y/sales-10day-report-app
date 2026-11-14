import sys
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={'width': 1400, 'height': 850})

    print('Step 1: Opening initial link...')
    page.goto('http://localhost:5173')
    page.wait_for_timeout(2500)
    page.screenshot(path=r'C:\Users\NUNES\.gemini\antigravity\brain\6e3a986f-0691-409d-9127-c709a98d6fb4\flow_step1_landing_page.png')
    print('Step 1 complete: Landing page screenshot saved.')

    # Step 2: Test 100 Actions from Landing Page
    print('Step 2: Clicking 100 Actions in navbar...')
    page.locator('a:has-text("100 Actions")').click()
    page.wait_for_timeout(2000)
    page.screenshot(path=r'C:\Users\NUNES\.gemini\antigravity\brain\6e3a986f-0691-409d-9127-c709a98d6fb4\flow_step2_100_actions_stage.png')
    print('Step 2 complete: 100 Actions Stage screenshot saved.')

    # Return to Landing Page
    print('Returning to Landing Page...')
    page.locator('button:has-text("Workspace")').click()
    page.wait_for_timeout(1000)

    # Step 3: Click Login on Landing Page
    print('Step 3: Clicking Login on Landing Page...')
    page.locator('a:has-text("Login")').first.click()
    page.wait_for_timeout(1500)
    page.screenshot(path=r'C:\Users\NUNES\.gemini\antigravity\brain\6e3a986f-0691-409d-9127-c709a98d6fb4\flow_step3_signin_card_prefilled.png')
    print('Step 3 complete: Sign-In card screenshot saved.')

    # Step 4: Click Sign In (1-click login)
    print('Step 4: Submitting pre-filled Sign In...')
    # If credentials aren't in localStorage for this fresh browser context, fill them quickly
    user_val = page.locator('input[type="text"]').input_value()
    if not user_val:
        page.locator('input[type="text"]').fill('md')
        page.locator('input[type="password"]').fill('md2026')
    page.locator('button[type="submit"]').click()
    page.wait_for_timeout(2000)
    page.screenshot(path=r'C:\Users\NUNES\.gemini\antigravity\brain\6e3a986f-0691-409d-9127-c709a98d6fb4\flow_step4_workspace_logged_in.png')
    print('Step 4 complete: Workspace logged in screenshot saved.')

    browser.close()
    print('All flow tests completed successfully!')
