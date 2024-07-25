import StartPage from '../pages/start'
import Page from '../pages/page'

context('Settings', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubGetPopUserOtp')
    cy.task('stubGetPopUserDetails')
    cy.task('stubHmppsToken')
    cy.task('stubGetLicenceConditions')
    cy.task('stubGetPopUserByUrn')
    cy.task('stubGetAppointments')
  })

  afterEach(() => {
    cy.get('[data-qa="signOut"]').click()
    Page.verifyOnPage(StartPage)
  })

  it('Should be able to see settings page and links', () => {
    cy.signIn()

    cy.get('[data-qa="settings-nav-link"]').click()
    cy.get('.govuk-heading-xl').contains('Settings')

    // change security link is set correctly
    cy.get('[data-qa="change-onelogin-link"]')
      .should('have.attr', 'href')
      .and('include', 'http://localhost:9091/govukOneLoginHome/security')
  })
})
