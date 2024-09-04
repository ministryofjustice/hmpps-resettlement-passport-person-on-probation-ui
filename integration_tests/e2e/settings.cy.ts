import Page, { SettingsPage } from '../pages/page'

context('Settings', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubForDefaultLoggedInUser')
  })

  it('Should be able to see settings page and links', () => {
    cy.signIn()

    cy.get('[data-qa="settings-nav-link"]').click()
    Page.verifyOnPage(SettingsPage)

    // change security link is set correctly
    cy.get('[data-qa="change-onelogin-link"]')
      .should('have.attr', 'href')
      .and('include', 'http://localhost:9091/govukOneLoginHome/security')
  })

  it('should be accessible', () => {
    cy.signIn()
    cy.get('[data-qa="settings-nav-link"]').click()
    Page.verifyOnPage(SettingsPage).runAxe()
  })
})
