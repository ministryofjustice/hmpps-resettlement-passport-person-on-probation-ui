import { Given, setDefaultTimeout, Then } from '@cucumber/cucumber'
import { expect, Page } from '@playwright/test'
import { pageFixture } from '../../hooks/pageFixtures'
import HomePage from '../../pageObjects/homePage'
import {returnSecurityCode, returnCurrentCount} from '../helpers/mailClient'
import {getMyOTP} from '../helpers/otpAuth'
import GovOneLogin from '../../pageObjects/govOne/govOneLogin'
import GovOneEnterEmail from '../../pageObjects/govOne/govOneEnterEmail'
import GovOneEnterPassword from '../../pageObjects/govOne/govOneEnterPassword'
import GovOneEnterOTPSecurityCode from '../../pageObjects/govOne/govOneEnterOTPSecurityCode'
import GovOneCreatePassword from '../../pageObjects/govOne/govOneCreatePassword'
import GovOneCreatedAccount from '../../pageObjects/govOne/govOneCreatedAccount'
import GovOneCheckEmail from '../../pageObjects/govOne/govOneCheckEmail'
import GovOneSelectOTPMethod from '../../pageObjects/govOne/govOneSelectOTPMethod'
import CompleteAccountPage from '../../pageObjects/completeAccountPage'
import DashboardPage from '../../pageObjects/dashboardPage'
import NavigationPage from '../../pageObjects/navigationPage'
import SettingsPage from '../../pageObjects/settingsPage'
import GovOneChangedOTP from '../../pageObjects/govOne/govOneChangedOTP'
import GovOneSecurityDetails from '../../pageObjects/govOne/govOneYourDetailsSecuityPage'

setDefaultTimeout(20000)
let page: Page;
let homePage: HomePage;
let govOneLogin: GovOneLogin;
//create account
let govOneCheckEmail: GovOneCheckEmail;
let govOneCreatePassword: GovOneCreatePassword;
let govOneSelectOTPMethod: GovOneSelectOTPMethod;
let govOneEnterOTPSecurityCode: GovOneEnterOTPSecurityCode;
let govOneCreatedAccount: GovOneCreatedAccount;

//delete account
let govOneChangedOTP: GovOneChangedOTP
let govOneSecurityDetails: GovOneSecurityDetails;

//login
let govOneEnterEmail: GovOneEnterEmail;
let govOneEnterPassword: GovOneEnterPassword;
let completeAccountPage: CompleteAccountPage;

//pyf pages
let dashboardPage: DashboardPage;
let navigationPage: NavigationPage;
let settingsPage: SettingsPage;


Given('the user visit plan your future', async function () {
  govOneLogin = new GovOneLogin(pageFixture.page);
  await govOneLogin.gotoIntegrationLogin();
  await govOneLogin.shouldFindTitle();
  homePage = new HomePage(pageFixture.page);
  await pageFixture.page.goto(process.env.BASEURL);
  homePage.shouldFindTitle();
})

Then('they should see the start page', async function () {
  await homePage.clickStart();

})


Then('they create an account with Gov One Login', async function () {
  govOneLogin = new GovOneLogin(pageFixture.page);
  govOneEnterEmail = new GovOneEnterEmail(pageFixture.page);
  govOneCheckEmail = new GovOneCheckEmail(pageFixture.page);
  govOneCreatePassword = new GovOneCreatePassword(pageFixture.page);
  govOneSelectOTPMethod = new GovOneSelectOTPMethod(pageFixture.page);
  govOneEnterOTPSecurityCode = new GovOneEnterOTPSecurityCode(pageFixture.page);
  govOneCreatedAccount = new GovOneCreatedAccount(pageFixture.page);

  await homePage.clickStart();
  const count = await returnCurrentCount();
  console.log('govOneLogin');
  await govOneLogin.createLogin.click();
  console.log('creating loging')
  await govOneEnterEmail.submitEmail('testuserpyf+51@gmail.com');
  const securityCode = await returnSecurityCode(count);
  console.log(securityCode);
  await govOneCheckEmail.submitCode(securityCode);
  await govOneCreatePassword.submitNewPassword('0net1mepa55');
  await govOneSelectOTPMethod.submitAuthAppOption();
  await govOneEnterOTPSecurityCode.iCannotSelectQRDropdown.click();
  const secret = await govOneEnterOTPSecurityCode.secretKey.innerText();
  console.log('secret Key '+ secret);
  var secretValue= secret.slice(12);
  console.log('secret Key Trim '+secretValue);
  const otpAuth = await getMyOTP(secretValue);
  await govOneEnterOTPSecurityCode.submitCode(otpAuth);
  await govOneCreatedAccount.shouldFindTitle();
  await govOneCreatedAccount.continue.click();
})

Then('the user completes the account setup with first-time ID code', async function () {
  completeAccountPage = new CompleteAccountPage(pageFixture.page);
  dashboardPage = new DashboardPage(pageFixture.page);
  await completeAccountPage.shouldFindTitle();
  await completeAccountPage.submitFirstTimeIdCode('3pkGVi');
  await completeAccountPage.submitDay('24');
  await completeAccountPage.submitMonth('10');
  await completeAccountPage.submitYear('1982');
  await dashboardPage.shouldFindTitle();
})

Then('the user deletes their Gov One Account', async function () {
  navigationPage = new NavigationPage(pageFixture.page);
  settingsPage = new SettingsPage(pageFixture.page);
  govOneSecurityDetails = new GovOneSecurityDetails(pageFixture.page);

  await navigationPage.settingsLink.click();
  await settingsPage.shouldFindTitle();
  await settingsPage.govOneLink.click();
  console.log('govOnelInkClicked');

  await govOneSecurityDetails.shouldFindTitle();
  await govOneSecurityDetails.gotoDeleteAccount();
  await govOneSecurityDetails.submitPassword('0net1mepa55');
  await govOneSecurityDetails.confirmAreYouSure();

})

// the following Code is when you delete your account but not immediatly from registration but from a login
Then('the user deletes their Gov One Account after logging in', async function () {
  const count = await returnCurrentCount();
  navigationPage = new NavigationPage(pageFixture.page);
  settingsPage = new SettingsPage(pageFixture.page);
  govOneEnterOTPSecurityCode = new GovOneEnterOTPSecurityCode(pageFixture.page);
  govOneCheckEmail = new GovOneCheckEmail(pageFixture.page);
  govOneSelectOTPMethod = new GovOneSelectOTPMethod(pageFixture.page);
  govOneChangedOTP = new GovOneChangedOTP(pageFixture.page);
  govOneSecurityDetails = new GovOneSecurityDetails(pageFixture.page);
  
  await navigationPage.settingsLink.click();
  await settingsPage.shouldFindTitle();
  await settingsPage.govOneLink.click();
  console.log('govOnelInkClicked');

  await govOneEnterOTPSecurityCode.gotoResetOTP();
  console.log('should have redirected to check email');
  const securityCode = await returnSecurityCode(count);
  console.log(securityCode);
  await govOneCheckEmail.submitCode(securityCode);
  await govOneSelectOTPMethod.submitAuthAppOption();
  await govOneEnterOTPSecurityCode.iCannotSelectQRDropdown.click();
  const secret = await govOneEnterOTPSecurityCode.secretKey.innerText();
  console.log('secret Key '+ secret);
  var secretValue= secret.slice(12);
  console.log('secret Key Trim '+secretValue);
  const otpAuth = await getMyOTP(secretValue);
  await govOneEnterOTPSecurityCode.submitCode(otpAuth);
  await govOneChangedOTP.continue.click();
  
  await govOneSecurityDetails.shouldFindTitle();
  await govOneSecurityDetails.gotoDeleteAccount();
  await govOneSecurityDetails.submitPassword('0net1mepa55');
  await govOneSecurityDetails.confirmAreYouSure();

})
