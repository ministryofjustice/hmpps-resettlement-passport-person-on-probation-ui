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
    cy.task('stubGetPopUserByUrn')
    cy.signIn()
  })

  afterEach(() => {
    cy.get('a.moj-sub-navigation__link[data-qa="signOut"]').click()
    cy.contains('You have been logged out.')
  })

  it('Should be able to see future and past Appointments from the appointment list', () => {
    // click sub navigation menu for appointments
    cy.get(':nth-child(2) > .moj-sub-navigation__link').click()
    Page.verifyOnPage(AppointmentsPage)

    // future appointments should be visible
    cy.get('[data-qa="appointment-box"]').should('exist')
    cy.contains('This is a future appointment')

    // past appointments should be visible when toggled
    cy.get('[data-qa="view-older-appointments"]').click()
    cy.contains('This is a past appointment')
  })

  it('Should be able to see the Appointments details', () => {
    // should be on the dashboard
    cy.contains('John Smith')

    // appointment card should exist and clickable
    cy.get('.card-body').should('exist')
    cy.get('#next-appointment-link').contains('This is a future appointment')
    cy.get('#next-appointment-link').click()

    // appointment details page should be visible for the selected appointment
    cy.get('.govuk-heading-xl').contains('Appointment details')
  })
})
