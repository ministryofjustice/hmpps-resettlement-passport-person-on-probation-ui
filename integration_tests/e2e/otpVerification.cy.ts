import OtpPage from '../pages/otp'
import Page from '../pages/page'
import OverviewPage from '../pages/overview'

context('OTP verification', () => {
  const enterValidOtp = () => {
    cy.get('#otp').type('123456')
    cy.get('#dobDay').type('11')
    cy.get('#dobMonth').type('1')
    cy.get('#dobYear').type('1959')
    cy.get('form').submit()
  }

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubGetPopUserOtp')
    cy.task('stubGetPopUserDetails')
    cy.task('stubHmppsToken')
  })

  it('Should not continue to Dashboard after validating Date (invalid)', () => {
    cy.signIn()
    cy.visit('/otp')
    Page.verifyOnPage(OtpPage)

    // invalid format
    cy.get('#otp').type('123456')
    cy.get('#dobDay').type('1')
    cy.get('#dobMonth').type('1')
    cy.get('#dobYear').type('abcde')
    cy.get('form').submit()
    cy.contains('There is a problem')
    cy.contains('Enter a date of birth in the correct format')
  })

  it('Should continue to Dashboard after validating OTP (valid)', () => {
    cy.task('stubGetPopUserByUrnUnverified')
    cy.signIn()
    cy.visit('/otp')
    Page.verifyOnPage(OtpPage)
    cy.task('stubGetPopUserByUrn')
    enterValidOtp()
    cy.contains('Overview')
  })

  it('Should redirect to OTP when user is not verified', () => {
    cy.task('stubGetPopUserByUrnUnverified')
    cy.signIn()
    cy.visit('/overview')
    Page.verifyOnPage(OtpPage)

    enterValidOtp()
    Page.verifyOnPage(OtpPage)
  })

  it('should redirect to overview if user is already verified', () => {
    cy.task('stubGetPopUserByUrn')
    cy.signIn()
    cy.visit('/otp')

    Page.verifyOnPage(OverviewPage)
  })

  it('OTP page accessibility', () => {
    cy.task('stubGetPopUserByUrnUnverified')
    cy.signIn()
    cy.visit('/overview')
    Page.verifyOnPage(OtpPage).runAxe()
  })
})
