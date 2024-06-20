import { Given, Then, setDefaultTimeout } from '@cucumber/cucumber'
import { pageFixture } from '../../hooks/pageFixtures'
import CommonPage from '../../pageObjects/psfr/commonPage'
import fs from 'fs'
import AxeBuilder from '@axe-core/playwright';
import { expect } from '@playwright/test';

let commonPage: CommonPage

setDefaultTimeout(100000)

Given('the user has access to their first-time ID code', async function () {
  commonPage = new CommonPage(pageFixture.page)
  const url = process.env.PSFRURL || ''
  const page = pageFixture.page
  await pageFixture.page.goto(url)
  await commonPage.logIn()
  await pageFixture.page.goto(`${url}/prisoner-overview/?prisonerNumber=A8731DY`)
  await pageFixture.page.getByText("Generate First-time ID code").click()
  var screenshotPath = 'test_results/screenshots/firstTimeID.png'
    // Take the screenshot itself.
  await pageFixture.page.screenshot({ path: screenshotPath, timeout: 5000 });
  const accessibilityScanResults = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
  .analyze();
  
  // commented out but retained if we want to introduce keeping report 
  //console.log(accessibilityScanResults);
  //var results = JSON.stringify(accessibilityScanResults);
  //fs.writeFile('./accessibilityScanResults.txt', results, (err) => {
  //  if (err) throw err;
  //  console.log(`access report written to accessibilityScanResults.txt`);
  //});

  expect(accessibilityScanResults.violations).toEqual([]);
  
  const otpCode = await (await pageFixture.page.waitForSelector('#otp-code')).innerText()
  fs.writeFile('./otp.txt', otpCode, (err) => {
    if (err) throw err;
    console.log(`OTP ${otpCode} written to otp.txt`);
  });

})


Then('the user requests for their first-time ID code', async function () {
  commonPage = new CommonPage(pageFixture.page)
  const url = process.env.PSFRURL || ''
  await pageFixture.page.goto(`${url}/prisoner-overview/?prisonerNumber=A8731DY`)
  await pageFixture.page.getByText("Generate First-time ID code").click()
  const otpCode = await (await pageFixture.page.waitForSelector('#otp-code')).innerText()
  fs.writeFile('./otp.txt', otpCode, (err) => {
    if (err) throw err;
    console.log(`OTP ${otpCode} written to otp.txt`);
  });

})
