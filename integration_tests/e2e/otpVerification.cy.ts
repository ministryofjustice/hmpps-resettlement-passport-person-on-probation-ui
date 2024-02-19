import OtpPage from '../pages/otp'
import GovukOneLoginPage from '../pages/govukOneLogin'
import Page from '../pages/page'
import DashboardPage from '../pages/dashboard'

context('OTP verification', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.visit('/otp')
    Page.verifyOnPage(GovukOneLoginPage)
    cy.signIn()
  })

  it('Should not continue to Dashboard after validating OTP (invalid)', () => {
    cy.visit('/otp') // replace with stubbing user verification
    Page.verifyOnPage(OtpPage)

    cy.get('#otp').type('abcqwe')
    cy.get('.govuk-button').click()
    Page.verifyOnPage(OtpPage)
    cy.contains('There is a problem')
  })

  it('Should continue to Dashboard after validating OTP (valid)', () => {
    cy.visit('/otp') // replace with stubbing user verification
    Page.verifyOnPage(OtpPage)
    
    cy.get('#otp').type('123456')
    cy.get('.govuk-button').click()
    Page.verifyOnPage(DashboardPage)
  })
})
