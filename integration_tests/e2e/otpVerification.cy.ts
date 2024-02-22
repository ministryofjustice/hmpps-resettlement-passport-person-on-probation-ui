import OtpPage from '../pages/otp'
import Page from '../pages/page'
import DashboardPage from '../pages/dashboard'

context('OTP verification', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubGetPopUserOtp', 'G4161UF')
    cy.task('stubHmppsToken')
    cy.task('stubGetPopUserByUrn')
  })

  it('Should not continue to Dashboard after validating OTP (invalid)', () => {
    cy.signIn()
    cy.visit('/otp')
    Page.verifyOnPage(OtpPage)

    cy.get('#otp').type('abcqwe')
    cy.get('.govuk-button').click()
    Page.verifyOnPage(OtpPage)
    cy.contains('There is a problem')
  })

  it('Should continue to Dashboard after validating OTP (valid)', () => {
    cy.signIn()
    cy.visit('/otp')
    Page.verifyOnPage(OtpPage)

    cy.get('#otp').type('123456')
    cy.get('.govuk-button').click()
    Page.verifyOnPage(DashboardPage)
  })
})
