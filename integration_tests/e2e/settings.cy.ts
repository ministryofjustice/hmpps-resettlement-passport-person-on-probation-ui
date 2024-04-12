import HomePage from '../pages/home'
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
  })

  afterEach(() => {
    cy.get('[data-qa="signOut"]').click()
    Page.verifyOnPage(HomePage)
  })

  it('Should be able to see settings page and links', () => {
    cy.signIn()

    // click sub navigation menu for profile
    cy.get(':nth-child(5) > .moj-sub-navigation__link').click()
    cy.get('.govuk-heading-xl').contains('Settings')

    // change security link is set correctly
    cy.get('[data-qa="change-onelogin-link"]')
      .should('have.attr', 'href')
      .and('include', 'http://localhost:9091/govukOneLoginHome/security')
  })
})
