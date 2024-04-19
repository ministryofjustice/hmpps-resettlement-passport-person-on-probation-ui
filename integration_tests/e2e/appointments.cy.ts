import AppointmentsPage from '../pages/appointment'
import HomePage from '../pages/home'
import Page from '../pages/page'

context('Appointments', () => {
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

  it('Should render no appointments for error responses', () => {
    cy.task('stubGetAppointmentsError')
    cy.signIn()
    // click sub navigation menu for appointments
    cy.get(':nth-child(2) > .moj-sub-navigation__link').click()
    cy.contains('Currently you have no future appointments')
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
    cy.get('[data-qa="1-appointment-details-link"]').should('exist')

    // past appointments should be visible when toggled
    cy.get('[data-qa="view-older-appointments"]').click()
    cy.contains('This is a past appointment')
  })

  it('Should be able to see the Appointments details', () => {
    cy.task('stubGetAppointments')
    cy.signIn()

    // click sub navigation menu for appointments
    cy.get(':nth-child(2) > .moj-sub-navigation__link').click()
    Page.verifyOnPage(AppointmentsPage)

    // future appointments should be visible
    cy.get('[data-qa="1-appointment-details-link"]').click()

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
    cy.get('[data-qa="1-appointment-details-link"]').should('not.exist')
  })
})
