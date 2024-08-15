import { Given, Then, setDefaultTimeout } from '@cucumber/cucumber'
import { pageFixture } from '../../hooks/pageFixtures'
import { expect } from '@playwright/test'
import CommonPage from '../../pageObjects/psfr/commonPage'
import fs from 'fs'

let commonPage: CommonPage

setDefaultTimeout(100000)

Given('the user has access to their first-time ID code', async function () {
  commonPage = new CommonPage(pageFixture.page)
  const url = process.env.PSFRURL || ''
  await pageFixture.page.goto(url)
  await commonPage.logIn()
  await pageFixture.page.goto(`${url}/prisoner-overview/?prisonerNumber=A8731DY`)
  await pageFixture.page.getByText("Generate First-time ID code").click()
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

// file path E2E_tests/test/helpers/LicenceConditionsExample.docx
Then('the user uploads a licence conditions document for a prisoner', async function () {
  commonPage = new CommonPage(pageFixture.page)
  const url = process.env.PSFRURL || ''
  await pageFixture.page.goto(url)
  await commonPage.logIn()
  await pageFixture.page.goto(`${url}/upload-documents?prisonerNumber=G5384GE`)
  const path = process.cwd();

  const handle = pageFixture.page.locator('input[type="file"]');
  await handle.setInputFiles(path+'/E2E_Tests/test/helpers/LicenceConditionsE2E.docx');
  await pageFixture.page.getByText("Continue").click();
  const docUrl = pageFixture.page.url();
  expect(docUrl).toEqual('https://resettlement-passport-ui-dev.hmpps.service.justice.gov.uk/prisoner-overview/?prisonerNumber=G5384GE#documents')  
})
