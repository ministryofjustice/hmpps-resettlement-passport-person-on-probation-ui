import OverviewPage from '../pages/overview'
import Page from '../pages/page'

context('NotFound', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubForDefaultLoggedInUser')
  })

  it('Should render page not found when logged in', () => {
    cy.signIn()
    Page.verifyOnPage(OverviewPage)
    cy.visit('/doesnotexist')
    cy.get('h1').contains('Page not found')
    cy.visit('/sign-out')
  })

  it('Should render page not found when not logged in', () => {
    cy.visit('/doesnotexist')
    cy.get('h1').contains('Page not found')
  })
})
