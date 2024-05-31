import { browser } from 'k6/experimental/browser'
import { describe, expect } from 'https://jslib.k6.io/k6chaijs/4.3.4.3/index.js'
import { sleep } from 'k6'
import { Trend } from 'k6/metrics'

import { GovOneLogin } from '../pages/govOne/govOneLogin.js'
import { Dashboard } from '../pages/dashboard.js'
import { NavigationBar } from '../pages/navigationBar.js'
import { Appointments } from '../pages/appointments.js'
import { Settings } from '../pages/settings.js'
import { Profile } from '../pages/profile.js'
import { LicenceConditions } from '../pages/licenceConditions.js'
import { SignOut } from '../pages/signOut.js'
import { GovOneEnterEmail } from '../pages/govOne/govOneEnterEmail.js'
import { GovOneEnterPassword } from '../pages/govOne/govOneEnterPassword.js'
import { GovOneEnterSecurityCode } from '../pages/govOne/govOneEnterOTPSecurityCode.js'
import { PYFLandingPage } from '../pages/pyfLandingPage.js'
import { totp } from '../helpers/otpAuth.js'




const myTrend = new Trend('total_dashboard_time', true)
let testVal

export async function mainDevBrowserTest() {
  const page = browser.newPage()

  const pYFLandingPage = new PYFLandingPage(page)
  const appointments = new Appointments(page)
  const licenceConditions = new LicenceConditions(page)
  const navigationBar = new NavigationBar(page)
  const dashboard = new Dashboard(page)
  const profile = new Profile(page)
  const settings = new Settings(page)
  const signOut = new SignOut(page)
  const enterEmail = new GovOneEnterEmail(page)
  const enterPassword = new GovOneEnterPassword(page)
  const screenshot = '../screenshots/'
  console.log('start of test')

  const govOneLogin = new GovOneLogin(page)

  try {
    // logs into GovOne before navigating to Plan Your Journey
    await govOneLogin.gotoIntegrationLogin()
    await govOneLogin.gotoPlan()
    console.log('gotoPlan')
    page.screenshot({ path: `${screenshot}startPYFJourney.png` })
    await Promise.all([page.waitForNavigation(), pYFLandingPage.startNowButton.click()])
    console.log('signIn')
    page.screenshot({ path: `${screenshot}signIn.png` })
    await Promise.all([page.waitForNavigation(), govOneLogin.signInButton.click()])
    console.log('email')
    page.screenshot({ path: `${screenshot}email.png` })
    await Promise.all([page.waitForNavigation(), enterEmail.submitEmail(__ENV.PT_USERNAME)])
    await Promise.all([page.waitForNavigation(), enterPassword.submitPassword(__ENV.PT_PASSWORD)])

    // checks duration of loading Dashboard Page
    page.evaluate(() => window.performance.mark('page-visit'))
    console.log('loggedIn')
    page.screenshot({ path: `${screenshot}dashboard.png` })
    describe('getDashboard', () => {
      testVal = dashboard.header.innerText()
      expect(testVal).to.equal('Overview')
      console.log('testDash')
    })

    page.evaluate(() => window.performance.mark('action-completed'))
    // measures total duration of loading Dashboard Page
    page.evaluate(() => window.performance.measure('total_dashboard_time', 'page-visit', 'action-completed'))

    const totalActionTime = page.evaluate(
      () => JSON.parse(JSON.stringify(window.performance.getEntriesByName('total_dashboard_time')))[0].duration,
    )
    myTrend.add(totalActionTime)

    await Promise.all([page.waitForNavigation(), navigationBar.appointments.click()])
    describe('getAppointments', async () => {
      page.screenshot({ path: `${screenshot}appointments.png` })
      testVal = appointments.header.innerText()
      expect(testVal).to.equal('Appointments')
      console.log('testAppointments')
    })

    await Promise.all([page.waitForNavigation(), navigationBar.licenceConditions.click()])
    await describe('getLicenceConditions', () => {
      page.screenshot({ path: `${screenshot}licence.png` })
      testVal = licenceConditions.header.innerText()
      expect(testVal).to.equal('Licence conditions')
      console.log('testLicence')
    })

    await Promise.all([page.waitForNavigation(), navigationBar.profile.click()])
    describe('getProfile', () => {
      page.screenshot({ path: `${screenshot}profile.png` })
      testVal = profile.header.innerText()
      expect(testVal).to.equal('Profile')
      console.log('testProfile')
    })

    await Promise.all([page.waitForNavigation(), navigationBar.settings.click()])
    describe('getSettings', () => {
      page.screenshot({ path: `${screenshot}settings.png` })
      testVal = settings.header.innerText()
      expect(testVal).to.equal('Settings')
      console.log('testSettings')
    })

    await Promise.all([page.waitForNavigation(), navigationBar.home.click()])
    describe('getDashboard', () => {
      testVal = dashboard.header.innerText()
      expect(testVal).to.equal('Overview')
      console.log('testDash')
    })

    await Promise.all([page.waitForNavigation(), dashboard.appointmentsTile.click()])
    describe('getAppointmentsTile', async () => {
      page.screenshot({ path: `${screenshot}appointmentsTile.png` })
      testVal = appointments.header.innerText()
      expect(testVal).to.equal('Appointments')
      console.log('testAppointmentsTile')
    })

    await Promise.all([page.waitForNavigation(), navigationBar.home.click()])
    describe('getDashboard', () => {
      testVal = dashboard.header.innerText()
      expect(testVal).to.equal('Overview')
      console.log('testDash')
    })

    await Promise.all([page.waitForNavigation(), dashboard.licenceConditionsTile.click()])
    describe('getLicenceConditionsTile', () => {
      page.screenshot({ path: `${screenshot}licenceTile.png` })
      testVal = licenceConditions.header.innerText()
      expect(testVal).to.equal('Licence conditions')
      console.log('testLicenceTile')
    })

    await Promise.all([page.waitForNavigation(), navigationBar.home.click()])
    describe('getDashboard', () => {
      testVal = dashboard.header.innerText()
      expect(testVal).to.equal('Overview')
      console.log('testDash')
    })

    await Promise.all([page.waitForNavigation(), dashboard.profileTile.click()])
    describe('getProfileTile', () => {
      page.screenshot({ path: `${screenshot}profile.png` })
      testVal = profile.header.innerText()
      expect(testVal).to.equal('Profile')
      console.log('testProfileTile')
    })

    await Promise.all([page.waitForNavigation(), navigationBar.home.click()])
    describe('getDashboard', () => {
      testVal = dashboard.header.innerText()
      expect(testVal).to.equal('Overview')
      console.log('testDash')
    })

    await Promise.all([page.waitForNavigation(), navigationBar.signOut.click()])
    
  } finally {
    page.close()
  }
}


export async function mainPreProdBrowserTest() {
  const page = browser.newPage()

  const pYFLandingPage = new PYFLandingPage(page)
  const appointments = new Appointments(page)
  const licenceConditions = new LicenceConditions(page)
  const navigationBar = new NavigationBar(page)
  const dashboard = new Dashboard(page)
  const profile = new Profile(page)
  const settings = new Settings(page)
  const signOut = new SignOut(page)
  const enterEmail = new GovOneEnterEmail(page)
  const enterPassword = new GovOneEnterPassword(page)
  const govOneEnterOTPSecurityCode = new GovOneEnterSecurityCode(page)
  const screenshot = '../screenshots/'
  console.log('start of test')

  const govOneLogin = new GovOneLogin(page)

  try {
    // logs into GovOne before navigating to Plan Your Journey
    await govOneLogin.gotoIntegrationLogin()
    await govOneLogin.gotoPPPlan()
    console.log('gotoPreProdPlan')
    page.screenshot({ path: `${screenshot}startPYFJourney.png` })
    await Promise.all([page.waitForNavigation(), pYFLandingPage.startNowButton.click()])
    console.log('signIn')
    page.screenshot({ path: `${screenshot}signIn.png` })
    await Promise.all([page.waitForNavigation(), govOneLogin.signInButton.click()])
    console.log('email')
    page.screenshot({ path: `${screenshot}email.png` })
    await Promise.all([page.waitForNavigation(), enterEmail.submitEmail(__ENV.PT_PP_USERNAME)])
    await Promise.all([page.waitForNavigation(), enterPassword.submitPassword(__ENV.PT_PASSWORD)])
    // gets OTP code using OTP secret value - if ever we update account this will need to be updated.
    const testOTP = await totp(__ENV.PT_OTPAUTHSECRET)
    console.log(testOTP) 
    await Promise.all([page.waitForNavigation(), govOneEnterOTPSecurityCode.submitCode(testOTP)])

    // checks duration of loading Dashboard Page
    page.evaluate(() => window.performance.mark('page-visit'))
    console.log('loggedIn')
    page.screenshot({ path: `${screenshot}dashboard.png` })
    describe('getDashboard', () => {
      testVal = dashboard.header.innerText()
      expect(testVal).to.equal('Overview')
      console.log('testDash')
    })

    page.evaluate(() => window.performance.mark('action-completed'))
    // measures total duration of loading Dashboard Page
    page.evaluate(() => window.performance.measure('total_dashboard_time', 'page-visit', 'action-completed'))

    const totalActionTime = page.evaluate(
      () => JSON.parse(JSON.stringify(window.performance.getEntriesByName('total_dashboard_time')))[0].duration,
    )
    myTrend.add(totalActionTime)

    await Promise.all([page.waitForNavigation(), navigationBar.appointments.click()])
    describe('getAppointments', async () => {
      page.screenshot({ path: `${screenshot}appointments.png` })
      testVal = appointments.header.innerText()
      expect(testVal).to.equal('Appointments')
      console.log('testAppointments')
    })

    await Promise.all([page.waitForNavigation(), navigationBar.licenceConditions.click()])
    await describe('getLicenceConditions', () => {
      page.screenshot({ path: `${screenshot}licence.png` })
      testVal = licenceConditions.header.innerText()
      expect(testVal).to.equal('Licence conditions')
      console.log('testLicence')
    })

    await Promise.all([page.waitForNavigation(), navigationBar.profile.click()])
    describe('getProfile', () => {
      page.screenshot({ path: `${screenshot}profile.png` })
      testVal = profile.header.innerText()
      expect(testVal).to.equal('Profile')
      console.log('testProfile')
    })

    await Promise.all([page.waitForNavigation(), navigationBar.settings.click()])
    describe('getSettings', () => {
      page.screenshot({ path: `${screenshot}settings.png` })
      testVal = settings.header.innerText()
      expect(testVal).to.equal('Settings')
      console.log('testSettings')
    })

    await Promise.all([page.waitForNavigation(), navigationBar.home.click()])
    describe('getDashboard', () => {
      testVal = dashboard.header.innerText()
      expect(testVal).to.equal('Overview')
      console.log('testDash')
    })

    await Promise.all([page.waitForNavigation(), dashboard.appointmentsTile.click()])
    describe('getAppointmentsTile', async () => {
      page.screenshot({ path: `${screenshot}appointmentsTile.png` })
      testVal = appointments.header.innerText()
      expect(testVal).to.equal('Appointments')
      console.log('testAppointmentsTile')
    })

    await Promise.all([page.waitForNavigation(), navigationBar.home.click()])
    describe('getDashboard', () => {
      testVal = dashboard.header.innerText()
      expect(testVal).to.equal('Overview')
      console.log('testDash')
    })

    await Promise.all([page.waitForNavigation(), dashboard.licenceConditionsTile.click()])
    describe('getLicenceConditionsTile', () => {
      page.screenshot({ path: `${screenshot}licenceTile.png` })
      testVal = licenceConditions.header.innerText()
      expect(testVal).to.equal('Licence conditions')
      console.log('testLicenceTile')
    })

    await Promise.all([page.waitForNavigation(), navigationBar.home.click()])
    describe('getDashboard', () => {
      testVal = dashboard.header.innerText()
      expect(testVal).to.equal('Overview')
      console.log('testDash')
    })

    await Promise.all([page.waitForNavigation(), dashboard.profileTile.click()])
    describe('getProfileTile', () => {
      page.screenshot({ path: `${screenshot}profile.png` })
      testVal = profile.header.innerText()
      expect(testVal).to.equal('Profile')
      console.log('testProfileTile')
    })

    await Promise.all([page.waitForNavigation(), navigationBar.home.click()])
    describe('getDashboard', () => {
      testVal = dashboard.header.innerText()
      expect(testVal).to.equal('Overview')
      console.log('testDash')
    })

    await Promise.all([page.waitForNavigation(), navigationBar.signOut.click()])
    
  } finally {
    page.close()
  }
}
