import HomePage from '../pages/home'
import Page from '../pages/page'

context('Error', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubGetPopUserOtp')
    cy.task('stubGetPopUserDetails')
    cy.task('stubHmppsToken')
    cy.task('stubGetPopUserByUrn')
  })

  afterEach(() => {
    cy.get('[data-qa="signOut"]').click()
    Page.verifyOnPage(HomePage)
  })

  it('Should render error when a 500 response is received', () => {
    cy.task('stubGetAppointmentsError')
    cy.signIn()
    cy.visit('/appointments')
    cy.get('[data-qa="error-page-title"]').contains('Sorry, there is a problem with the service')
  })
})
