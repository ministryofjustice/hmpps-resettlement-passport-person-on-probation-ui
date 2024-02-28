import AppointmentsPage from '../pages/appointment'
import Page from '../pages/page'

context('Appointments', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubGetPopUserOtp')
    cy.task('stubGetPopUserDetails')
    cy.task('stubGetAppointments')
    cy.task('stubHmppsToken')
  })

  it('Should continue to Appointments after login', () => {
    cy.task('stubGetPopUserByUrn')
    cy.signIn()
    cy.contains('John Smith')
    cy.visit('/appointments')
    Page.verifyOnPage(AppointmentsPage)

    cy.get('[data-qa="appointment-box"]').should('exist')
    cy.contains('This is a future appointment')

    cy.get('[data-qa="view-older-appointments"]').click()
    cy.contains('This is a past appointment')
  })
})
