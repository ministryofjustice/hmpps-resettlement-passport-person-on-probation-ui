import { Given, Then, setDefaultTimeout } from '@cucumber/cucumber'
import { pageFixture } from '../../hooks/pageFixtures'
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
