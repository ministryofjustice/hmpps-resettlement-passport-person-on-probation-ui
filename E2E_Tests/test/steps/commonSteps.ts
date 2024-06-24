import { Given, setDefaultTimeout, Then } from '@cucumber/cucumber'
import { expect, Page } from '@playwright/test'
import { pageFixture } from '../../hooks/pageFixtures'
import HomePage from '../../pageObjects/homePage'
import {returnSecurityCode, returnCurrentCount, returnAccountClosed} from '../helpers/mailClient'
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
import { getFirstTimeIdCode, getDobArray } from '../helpers/firstTimeIdCode'



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

const email = process.env.USEREMAIL
const password = process.env.USERPASSWORD


function sleep(ms: number | undefined) {
  console.log('waiting')
  return new Promise(resolve => setTimeout(resolve, ms))
}



Given('the user visit plan your future', async function () {
  govOneLogin = new GovOneLogin(pageFixture.page);
  await govOneLogin.gotoIntegrationLogin();
  await govOneLogin.shouldFindTitle();
  homePage = new HomePage(pageFixture.page);
  await pageFixture.page.goto(process.env.BASEURL);
  homePage.shouldFindTitle();
})

Then('the user revisits plan your future', async function () {
  govOneLogin = new GovOneLogin(pageFixture.page);
  homePage = new HomePage(pageFixture.page);
  await pageFixture.page.goto(process.env.BASEURL);
  homePage.shouldFindTitle();
})

Then('they should see the start page', async function () {
  await homePage.clickStart();

})

Then('the user views all content as listed in contents and scans page accessibility for each page', async function () {
  
  var contentList = await homePage.contentsList.innerText();
  console.log(contentList);
  let contents: string[] = contentList.split("\n");
  console.log(contents);
  let contentsReverse : string[] = [];
  contents.slice().reverse().forEach(x => contentsReverse.push(x));
  console.log(contentsReverse);

  console.log(contentsReverse.length);
  var contentLength = contentsReverse.length;
  for (const content of contentsReverse) {
    var pageTitle = await homePage.pageContentsTitle.innerText();
    console.log('page title '+ pageTitle);
    expect(content).toEqual(pageTitle); 
    console.log('Page analyzed '+ content);
    await homePage.scanPageAccessibilty();
    // will page through until end of contents list
    if (contentLength > 1){
      await pageFixture.page.locator('[data-qa="prev-btn"]').click();
    }
    contentLength --;
  }

})

Then('the user Logs Out of the service', async function () {
  navigationPage = new NavigationPage(pageFixture.page);
  await navigationPage.signOutLink.click();
})

Then('the user will be still logged into current session so Logs Out of the service', async function () {
  navigationPage = new NavigationPage(pageFixture.page);
  await homePage.clickStart();
  await navigationPage.signOutLink.click();
})


Then('they create an account with Gov One Login email {string}', async function (gmail) {
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
  await govOneEnterEmail.submitEmail(email+gmail);
  const securityCode = await returnSecurityCode(count);
  console.log("..." + securityCode.slice(-3));
  await govOneCheckEmail.submitCode(securityCode);
  await govOneCreatePassword.submitNewPassword(password);
  await govOneSelectOTPMethod.submitAuthAppOption();
  await govOneEnterOTPSecurityCode.iCannotSelectQRDropdown.click();
  const secret = await govOneEnterOTPSecurityCode.secretKey.innerText();
  console.log('secret Key ...'+ secret.slice(-3));
  var secretValue= secret.slice(12);
  console.log('secret Key Trim ...'+secretValue.slice(-3));
  const otpAuth = await getMyOTP(secretValue);
  await govOneEnterOTPSecurityCode.submitCode(otpAuth);
  await govOneCreatedAccount.shouldFindTitle();
  await govOneCreatedAccount.continue.click();
})


Then('they try to re-create an existing account with Gov One Login email {string}', async function (gmail) {
  govOneLogin = new GovOneLogin(pageFixture.page);
  govOneEnterEmail = new GovOneEnterEmail(pageFixture.page);
  govOneCreatedAccount = new GovOneCreatedAccount(pageFixture.page);
  navigationPage = new NavigationPage(pageFixture.page);
  govOneEnterPassword = new GovOneEnterPassword(pageFixture.page)
  dashboardPage = new DashboardPage(pageFixture.page);
  await homePage.clickStart();
  const count = await returnCurrentCount();
  console.log('govOneLogin');
  await govOneLogin.createLogin.click();
  console.log('creating loging')
  await govOneEnterEmail.submitEmail(email+gmail);
  await expect(navigationPage.pageHeader).toHaveText('You have a GOV.UK One Login');
  await govOneEnterPassword.submitPassword(password);
  await dashboardPage.shouldFindTitle();
})

Then('the user logs into their account who has completed account setup email {string}', async function (gmail) {
  govOneLogin = new GovOneLogin(pageFixture.page);
  govOneEnterEmail = new GovOneEnterEmail(pageFixture.page);
  govOneEnterPassword = new GovOneEnterPassword(pageFixture.page)
  dashboardPage = new DashboardPage(pageFixture.page);
  await homePage.clickStart();
  await govOneLogin.signInButton.click();
  console.log('user loging into account')
  await govOneEnterEmail.submitEmail(email+gmail);
  await govOneEnterPassword.submitPassword(password);
  await dashboardPage.shouldFindTitle();
  
})


Then('the user logs into their account who has not completed account setup email {string}', async function (gmail) {
  govOneLogin = new GovOneLogin(pageFixture.page);
  govOneEnterEmail = new GovOneEnterEmail(pageFixture.page);
  govOneEnterPassword = new GovOneEnterPassword(pageFixture.page)
  completeAccountPage = new CompleteAccountPage(pageFixture.page);
  await homePage.clickStart();
  await govOneLogin.signInButton.click();
  console.log('user loging into account')
  await govOneEnterEmail.submitEmail(email+gmail);
  await govOneEnterPassword.submitPassword(password);
  await completeAccountPage.shouldFindTitle();
})

Then('the user completes the account setup with first-time ID code', async function () {
  completeAccountPage = new CompleteAccountPage(pageFixture.page);
  dashboardPage = new DashboardPage(pageFixture.page);
  await sleep(500)
  await completeAccountPage.shouldFindTitle();
  const firstTimeIdCode = await getFirstTimeIdCode();
  await completeAccountPage.submitFirstTimeIdCode(firstTimeIdCode);
  const dob = getDobArray
  await completeAccountPage.submitDay(getDobArray[0]);
  await completeAccountPage.submitMonth(getDobArray[1]);
  await completeAccountPage.submitYear(getDobArray[2]);
  await sleep(500)
  await dashboardPage.shouldFindTitle();
})

Then('the user completes the account setup with expired first-time ID code', async function () {
  completeAccountPage = new CompleteAccountPage(pageFixture.page);
  dashboardPage = new DashboardPage(pageFixture.page);
  await sleep(500)
  await completeAccountPage.shouldFindTitle();
  const firstTimeIdCode = await getFirstTimeIdCode();
  await completeAccountPage.submitFirstTimeIdCode(firstTimeIdCode);
  const dob = getDobArray
  await completeAccountPage.submitDay(getDobArray[0]);
  await completeAccountPage.submitMonth(getDobArray[1]);
  await completeAccountPage.submitYear(getDobArray[2]);
  await expect(completeAccountPage.warning).toHaveText('The First-time ID code entered is not associated with the date of birth provided');
})

Then('the user deletes their Gov One Account', async function () {
  const count = await returnCurrentCount();
  navigationPage = new NavigationPage(pageFixture.page);
  settingsPage = new SettingsPage(pageFixture.page);
  govOneSecurityDetails = new GovOneSecurityDetails(pageFixture.page);
  await sleep(500)
  await navigationPage.settingsLink.click();
  await settingsPage.shouldFindTitle();
  await settingsPage.govOneLink.click();
  console.log('govOnelinkClicked');

  await govOneSecurityDetails.shouldFindTitle();
  await govOneSecurityDetails.gotoDeleteAccount();
  await govOneSecurityDetails.submitPassword(password);
  await govOneSecurityDetails.confirmAreYouSure();
  const messageSnippet = await returnAccountClosed(count);
  expect(messageSnippet).toContain('permanently deleted your GOV.​UK One Login') 
  console.log('govOne Account Deleted');

})

// the following Code is when you delete your account but not immediatly from registration but from a login
Then('the user deletes their Gov One Account after logging in', async function () {
  var count = await returnCurrentCount();
  navigationPage = new NavigationPage(pageFixture.page);
  settingsPage = new SettingsPage(pageFixture.page);
  govOneEnterOTPSecurityCode = new GovOneEnterOTPSecurityCode(pageFixture.page);
  govOneCheckEmail = new GovOneCheckEmail(pageFixture.page);
  govOneSelectOTPMethod = new GovOneSelectOTPMethod(pageFixture.page);
  govOneChangedOTP = new GovOneChangedOTP(pageFixture.page);
  govOneSecurityDetails = new GovOneSecurityDetails(pageFixture.page);
  await sleep(500)
  await navigationPage.settingsLink.click();
  await settingsPage.shouldFindTitle();
  await settingsPage.govOneLink.click();
  console.log('govOnelinkClicked');

  await govOneEnterOTPSecurityCode.gotoResetOTP();
  console.log('should have redirected to check email');
  const securityCode = await returnSecurityCode(count);
  console.log(securityCode);
  await govOneCheckEmail.submitCode(securityCode);
  await govOneSelectOTPMethod.submitAuthAppOption();
  await govOneEnterOTPSecurityCode.iCannotSelectQRDropdown.click();
  const secret = await govOneEnterOTPSecurityCode.secretKey.innerText();
  console.log('secret Key ...'+ secret.slice(-3));
  var secretValue= secret.slice(12);
  console.log('secret Key Trim ...'+secretValue.slice(-3));
  const otpAuth = await getMyOTP(secretValue);
  await govOneEnterOTPSecurityCode.submitCode(otpAuth);
  await govOneChangedOTP.continue.click();
  
  await govOneSecurityDetails.shouldFindTitle();
  count = await returnCurrentCount();
  await govOneSecurityDetails.gotoDeleteAccount();
  await govOneSecurityDetails.submitPassword(password);
  await govOneSecurityDetails.confirmAreYouSure();
  const messageSnippet = await returnAccountClosed(count);
  expect(messageSnippet).toContain('permanently deleted your GOV.​UK One Login') 
  console.log('govOne Account Deleted');

})

// the following Code is if error in tests and account is still existing this will delete account for next run; controlled in feature file. 
Then('delete account housekeeping email {string}', async function (gmail) {

  govOneLogin = new GovOneLogin(pageFixture.page);
  govOneEnterEmail = new GovOneEnterEmail(pageFixture.page);
  govOneEnterPassword = new GovOneEnterPassword(pageFixture.page)
  dashboardPage = new DashboardPage(pageFixture.page);
  navigationPage = new NavigationPage(pageFixture.page);
  settingsPage = new SettingsPage(pageFixture.page);
  govOneCheckEmail = new GovOneCheckEmail(pageFixture.page);
  govOneChangedOTP = new GovOneChangedOTP(pageFixture.page);
  govOneSecurityDetails = new GovOneSecurityDetails(pageFixture.page);
  govOneSelectOTPMethod = new GovOneSelectOTPMethod(pageFixture.page);
  govOneEnterOTPSecurityCode = new GovOneEnterOTPSecurityCode(pageFixture.page);
  govOneCreatedAccount = new GovOneCreatedAccount(pageFixture.page);
  completeAccountPage = new CompleteAccountPage(pageFixture.page);

  await homePage.clickStart();
  await govOneLogin.signInButton.click();
  console.log('user loging into account')
  await govOneEnterEmail.submitEmail(email+gmail);
  // check header here to see if account exists..
  var testVal0 = await navigationPage.pageHeader.innerText();
  console.log(testVal0);
  if ((testVal0 == 'Enter your password')) {
    console.log('continuing to log into account');
    await govOneEnterPassword.submitPassword(password);
    // check header here to see Gov One Acc and has been completed
    var testVal1 = await navigationPage.pageHeader.innerText();
    console.log(testVal1);
    var count = await returnCurrentCount();
    if ((testVal1 == 'Finish creating your GOV.UK One Login')) {
      
      await govOneSelectOTPMethod.submitAuthAppOption();
      await govOneEnterOTPSecurityCode.iCannotSelectQRDropdown.click();
      const secret = await govOneEnterOTPSecurityCode.secretKey.innerText();
      console.log('secret Key ...'+ secret.slice(-3));
      var secretValue= secret.slice(12);
      console.log('secret Key Trim ...'+secretValue.slice(-3));
      const otpAuth = await getMyOTP(secretValue);
      await govOneEnterOTPSecurityCode.submitCode(otpAuth);
      await govOneCreatedAccount.shouldFindTitle();
      await govOneCreatedAccount.continue.click();
      await govOneSecurityDetails.gotoDeleteAccount();
      await govOneSecurityDetails.submitPassword(password);
      await govOneSecurityDetails.confirmAreYouSure();
      const messageSnippet = await returnAccountClosed(count);
      expect(messageSnippet).toContain('permanently deleted your GOV.​UK One Login') 
      console.log('govOne Account Deleted');
    }
    else {
        // check to see if account is fully registered
        var testVal2 = await navigationPage.pageHeader.innerText();
        console.log(testVal2);
        if ((testVal2 == 'Complete your account setup securely')) {
          console.log('continuing to setup account');
          // if not completed registration complete registration
          await completeAccountPage.shouldFindTitle();
          const firstTimeIdCode = await getFirstTimeIdCode();
          await completeAccountPage.submitFirstTimeIdCode(firstTimeIdCode);
          const dob = getDobArray
          await completeAccountPage.submitDay(getDobArray[0]);
          await completeAccountPage.submitMonth(getDobArray[1]);
          await completeAccountPage.submitYear(getDobArray[2]);
          }
        console.log('deleteing account');
        await dashboardPage.shouldFindTitle();


        await navigationPage.settingsLink.click();
        await settingsPage.shouldFindTitle();
        await settingsPage.govOneLink.click();
        console.log('govOnelinkClicked');

        await govOneEnterOTPSecurityCode.gotoResetOTP();
        count = await returnCurrentCount();
        console.log('should have redirected to check email');
        const securityCode = await returnSecurityCode(count);
        console.log(securityCode);
        await govOneCheckEmail.submitCode(securityCode);
        await govOneSelectOTPMethod.submitAuthAppOption();
        await govOneEnterOTPSecurityCode.iCannotSelectQRDropdown.click();
        const secret = await govOneEnterOTPSecurityCode.secretKey.innerText();
        console.log('secret Key ...'+ secret.slice(-3));
        var secretValue= secret.slice(12);
        console.log('secret Key Trim ...'+secretValue.slice(-3));
        const otpAuth = await getMyOTP(secretValue);
        await govOneEnterOTPSecurityCode.submitCode(otpAuth);
        await govOneChangedOTP.continue.click();

        count = await returnCurrentCount();
        await govOneSecurityDetails.shouldFindTitle();
        await govOneSecurityDetails.gotoDeleteAccount();
        await govOneSecurityDetails.submitPassword(password);
        await govOneSecurityDetails.confirmAreYouSure();
        const messageSnippet = await returnAccountClosed(count);
        expect(messageSnippet).toContain('permanently deleted your GOV.​UK One Login') 
        console.log('govOne Account Deleted');

      } 
  }
  else{
  // no need to delete account if not in if statement.
  console.log('no account was to be deleted');
  }

})
