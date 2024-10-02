context('Error', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubForDefaultLoggedInUser')
  })

  it('Should render error when a 500 response is received', () => {
    cy.task('stubGetAppointmentsError')
    cy.signIn({ failOnStatusCode: false })
    cy.visit('/appointments', { failOnStatusCode: false })
    cy.get('[data-qa="error-page-title"]').contains('Sorry, there is a problem with the service')
  })
})
