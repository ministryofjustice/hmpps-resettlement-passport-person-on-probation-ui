import GovukOneLoginPage from '../pages/govukOneLogin'
import Page from '../pages/page'
import HomePage from '../pages/home'
import OtpPage from '../pages/otp'

context('Sign in with GOV.UK One Login', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
  })

  it('Unauthenticated user not redirected - home page', () => {
    cy.visit('/')
    Page.verifyOnPage(HomePage)
  })

  it('Unauthenticated user redirected to GOV.UK One Login - OTP', () => {
    cy.visit('/otp')
    Page.verifyOnPage(GovukOneLoginPage)
  })

  it('Unauthenticated user redirected to GOV.UK One Login - sign-in URL', () => {
    cy.visit('/sign-in')
    Page.verifyOnPage(GovukOneLoginPage)
  })

  it('User sent to auth error page if sign in fails', () => {
    // setting an invalid nonce value should cause ID token validation to fail
    cy.signIn({ failOnStatusCode: false, nonce: 'INVALID_NONCE' })
    cy.get('h1').contains('Authorisation Error')
  })

  it('User can sign in and view callback page', () => {
    cy.signIn()
    Page.verifyOnPage(OtpPage)
    cy.get('a.moj-sub-navigation__link[data-qa="signOut"]').click()
    Page.verifyOnPage(HomePage)
  })
})
