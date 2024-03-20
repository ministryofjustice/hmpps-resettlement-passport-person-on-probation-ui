import AppointmentsPage from '../../pages/appointment'
import Page from '../../pages/page'

context('Appointments', () => {
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
    cy.contains('You have been logged out.')
  })

  it('Should render alert box for todays appointments', () => {
    cy.task('stubGetAppointmentsToday')
    cy.signIn()
    cy.get('.govuk-notification-banner__heading').contains('You have 2 appointments today')
  })

  it('Should render alert box for tomorrows appointments', () => {
    cy.task('stubGetAppointments')
    cy.signIn()
    cy.get('.govuk-notification-banner__heading').contains('You have 2 appointments tomorrow')
  })

  it('Should be able to see future and past Appointments from the appointment list', () => {
    cy.task('stubGetAppointments')
    cy.signIn()

    // click sub navigation menu for appointments
    cy.get(':nth-child(2) > .moj-sub-navigation__link').click()
    Page.verifyOnPage(AppointmentsPage)

    // future appointments should be visible
    cy.get('[data-qa="appointment-box"]').should('exist')
    cy.contains('This is a future appointment')
    cy.get('#view-details-link').should('exist')

    // past appointments should be visible when toggled
    cy.get('[data-qa="view-older-appointments"]').click()
    cy.contains('This is a past appointment')
  })

  it('Should be able to see the Appointments Tile', () => {
    cy.task('stubGetAppointments')
    cy.signIn()

    // should be on the dashboard
    cy.contains('John Smith')

    // appointment tile should exist and clickable
    cy.get('#appointments-tile').should('exist')
    cy.get('#next-appointment-title').contains('This is a future appointment')
  })

  it('Should be able to see the Appointments details', () => {
    cy.task('stubGetAppointments')
    cy.signIn()

    // click sub navigation menu for appointments
    cy.get(':nth-child(2) > .moj-sub-navigation__link').click()
    Page.verifyOnPage(AppointmentsPage)

    // future appointments should be visible
    cy.get('#view-details-link').first().click()

    // appointment details page should be visible for the selected appointment
    cy.get('.govuk-heading-xl').contains('Appointment details')
    cy.contains('This is a future appointment')

    // appointment navigation should be present
    cy.get('#all-navigation-link').should('exist')
    cy.get('#previous-navigation-link').should('not.exist')
    cy.get('#next-navigation-link').should('exist')

    // next link takes me to another view
    cy.get('#next-navigation-link').click()
    cy.contains('This is another future appointment')
    cy.get('#all-navigation-link').should('exist')
    cy.get('#previous-navigation-link').should('exist')
    cy.get('#next-navigation-link').should('not.exist')
    cy.get('#view-details-link').should('not.exist')
  })
})
