import { Before, BeforeAll, AfterAll, After } from '@cucumber/cucumber'
import { Browser, BrowserContext, chromium, firefox, Page, webkit } from '@playwright/test'
import { deleteMessageHousekeeping } from '../test/helpers/mailClient'
import { pageFixture } from './pageFixtures'

require('dotenv').config()

let browser: Browser
// let page: Page;
let context: BrowserContext
var count= 0;

BeforeAll(async function () {
  browser = await chromium.launch({ headless: true }) // launches a chrome instance and returns a browser
})

Before(async function () {
  // Before Each Scenario
  context = await browser.newContext() // sets up incognito mode returns a browser context
  const page = await context.newPage() // new page in the browser returns page
  pageFixture.page = page // map to global page variable
  await pageFixture.page.goto(process.env.BASEURL)
  console.log(`This is the base URL ${process.env.BASEURL}`)
})

After(async function () {
  // After each scenario
  await screenshotOnFailure();
  await pageFixture.page.close()
  await context.close()
})

AfterAll(async function () {
  // After All Tests
  await deleteMessageHousekeeping()
  await browser.close()
  
})


async function screenshotOnFailure() {
    // Get a unique place for the screenshot.
    count++
    const mytestID= 'TestNumber'+ count
    console.log(mytestID)
    
    var screenshotPath = 'test_results/screenshots/'+mytestID+'.png'
    // Take the screenshot itself.
    await pageFixture.page.screenshot({ path: screenshotPath, timeout: 5000 });
    
}