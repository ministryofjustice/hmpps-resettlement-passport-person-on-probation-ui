import AppointmentsPage from '../pages/appointment'
import StartPage from '../pages/start'
import Page from '../pages/page'
import OverviewPage from '../pages/overview'
import { FeatureFlagKey } from '../../server/services/featureFlags'

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
    Page.verifyOnPage(StartPage)
    cy.task('restoreFlags')
  })

  it('Should render no appointments for 404 responses', () => {
    cy.task('stubGetAppointmentsMissing')
    cy.signIn()
    // click sub navigation menu for appointments
    cy.get(':nth-child(2) > .moj-sub-navigation__link').click()
    cy.contains('Currently you have no future appointments')
  })

  it('Should redirect to overview when appointments disabled', () => {
    cy.task('stubGetAppointments')
    cy.task('disableFlag', FeatureFlagKey.VIEW_APPOINTMENTS)
    cy.signIn()
    cy.visit('/appointments')
    Page.verifyOnPage(OverviewPage)
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
    cy.get('[data-qa="1-appointment-details-link"]').should('not.exist')
    cy.get('[data-qa="1-appointment-no-location"]').contains(
      'We cannot show the address for this appointment. Contact your probation officer for the details.',
    )

    // only 1 appointment date heading is visible per unique Day
    cy.get('[data-qa="1-appointment-date"]').should('exist')
    cy.get('[data-qa="2-appointment-date"]').should('not.exist')

    // past appointments should be visible when toggled
    cy.get('[data-qa="view-older-appointments"]').click()
    cy.contains('This is a past appointment')
    cy.get('[data-qa="1-old-appointment-date"]').should('exist')
  })

  // Removed in PLT-282 will be re-instated in the near future
  it.skip('Should be able to see the Appointments details', () => {
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
