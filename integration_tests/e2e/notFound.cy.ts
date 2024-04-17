import DashboardPage from '../pages/dashboard'
import HomePage from '../pages/home'
import Page from '../pages/page'

context('NotFound', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubGetPopUserOtp')
    cy.task('stubGetPopUserDetails')
    cy.task('stubHmppsToken')
    cy.task('stubGetPopUserByUrn')
    cy.task('stubGetLicenceConditions')
  })

  afterEach(() => {
    cy.visit('/sign-out')
    Page.verifyOnPage(HomePage)
  })

  it('Should render page not found', () => {
    cy.signIn()
    Page.verifyOnPage(DashboardPage)
    cy.visit('/doesnotexist')
    cy.get('h1').contains('Page not found')
  })
})
