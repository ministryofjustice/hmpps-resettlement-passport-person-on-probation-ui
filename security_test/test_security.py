#!/usr/bin/env python
from playwright.sync_api import sync_playwright, Playwright
from zapv2 import ZAPv2, reports
import time

# Change to match the API key set in ZAP, or use None if the API key is disabled
zap_api_key = "15jae1iqcvcpumvqk4f70ohlq8"
proxy_url = "http://localhost:8181"


def run(playwright: Playwright):
    zap = ZAPv2(apikey=proxy_url, proxies={'http': "http://localhost:8181"})
    chromium = playwright.chromium
    browser = chromium.launch(headless=True, proxy={"server": proxy_url})
    context = browser.new_context(ignore_https_errors=True)
    page = context.new_page()
    page.goto("https://integration-user:winter2021@signin.integration.account.gov.uk/")
    page.goto("https://person-on-probation-user-ui-dev.hmpps.service.justice.gov.uk/")
    page.locator('[data-qa="start-btn"]').click()
    page.locator('//*[@id="sign-in-button"]').click()

    page.locator('//*[@id="email"]').fill("testuserpyf+1@gmail.com")
    page.locator('//*[@id="main-content"]/div/div/form/button').click()
    page.locator('//*[@id="password"]').fill("0net1mepa55")
    page.locator('//*[@id="form-tracking"]/button').click()
    assert page.inner_text('[data-qa="pyf-overview-h1"]') == "Overview"


    # Spider the target URL

    target_url = "https://person-on-probation-user-ui-dev.hmpps.service.justice.gov.uk/"

    print(f"Spidering target URL: {target_url}")

    zap.spider.scan(target_url)

    

    # Wait for the spider to finish

    time.sleep(5)

    

    # Wait for passive scanning to complete

    while int(zap.pscan.records_to_scan) > 0:

        print(f"Records to passive scan: {zap.pscan.records_to_scan}")

        time.sleep(20)

    

    # Start active scanning

    print("Starting active scan…")

    zap.ascan.scan(target_url)

    # Wait for the active scan to finish

    while int(zap.ascan.status()) < 100:
#
        print(f"Active Scan progress: {zap.ascan.status()}%")

        time.sleep(50)

    

    # Generate the report

    print("Generating HTML report…")

    sec_report_html = zap.core.htmlreport()

    with open("zap_report.html", "w") as file:

       file.write(sec_report_html)

    

    print("Security scan completed successfully.")



    browser.close()


with sync_playwright() as playwright:
    run(playwright)