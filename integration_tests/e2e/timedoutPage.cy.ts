import StartPage from '../pages/start'
import Page from '../pages/page'
import OverviewPage from '../pages/overview'

context('TimedOut', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubGetPopUserOtp')
    cy.task('stubGetPopUserDetails')
    cy.task('stubHmppsToken')
    cy.task('stubGetPopUserByUrn')
  })

  it('Should render the timed out page and should be able to return to start', () => {
    cy.task('stubTimedOut')
    cy.signIn()
    Page.verifyOnPage(OverviewPage)

    // simulate a 'timed sign-out' event
    cy.visit('/sign-out-timed')

    cy.get('[data-qa="timedout-page-title"]').contains('You have been signed out')
    cy.get('[data-qa="timedout-return-link"]').click()
    Page.verifyOnPage(StartPage)
  })
})
