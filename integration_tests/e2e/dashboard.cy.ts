import DashboardPage from '../pages/dashboard'
import HomePage from '../pages/home'
import Page from '../pages/page'

context('Dashboard', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubGetPopUserOtp')
    cy.task('stubGetPopUserDetails')
    cy.task('stubHmppsToken')
    cy.task('stubGetPopUserByUrn')
    cy.task('stubGetLicenceConditions')
    cy.task('stubGetLicenceConditionImage')
  })

  afterEach(() => {
    cy.get('[data-qa="signOut"]').click()
    Page.verifyOnPage(HomePage)
  })

  it('Should render alert box for todays appointments', () => {
    cy.task('stubGetAppointmentsToday')
    cy.signIn()
    Page.verifyOnPage(DashboardPage)
    cy.get('.govuk-notification-banner__heading').contains('You have 2 appointments today')
  })

  it('Should render alert box for tomorrows appointments', () => {
    cy.task('stubGetAppointments')
    cy.signIn()
    Page.verifyOnPage(DashboardPage)
    cy.get('.govuk-notification-banner__heading').contains('You have 2 appointments tomorrow')
  })

  it('Should be able to see the Licence Conditions Tile', () => {
    cy.task('stubGetAppointments')
    cy.signIn()
    Page.verifyOnPage(DashboardPage)

    // licence-conditions tile should exist and clickable
    cy.get('#licence-conditions-tile').should('exist')
    cy.get('#licence-conditions-tile-body').contains('Your licence conditions expire on 12 July 2023')
  })

  it('Should see alternative text on Licence Conditions Tile when licence conditions missing', () => {
    cy.task('stubGetAppointments')
    cy.task('stubGetLicenceConditionsMissing')
    cy.signIn()
    Page.verifyOnPage(DashboardPage)
    cy.get('#licence-conditions-tile-body').contains(
      'We cannot show your licence conditions. Ask your probation officer for details.',
    )
  })

  it('Should be able to see the Appointments Tile', () => {
    cy.task('stubGetAppointments')
    cy.signIn()

    // should be on the dashboard
    Page.verifyOnPage(DashboardPage)
    cy.contains('John Smith')

    // appointment tile should exist and clickable
    cy.get('#appointments-tile').should('exist')
    cy.get('#next-appointment-title').contains('This is a future appointment')
  })

  it('Should be able to see the Appointments Tile even with no appointments', () => {
    cy.task('stubGetAppointmentsMissing')
    cy.signIn()
    Page.verifyOnPage(DashboardPage)
    cy.get('#appointments-tile').should('exist')
    cy.get('[data-qa="appointment-tile-no-content"]').contains("There's no future appointments to show you.")
  })

  it('Should be able to see the Appointments Tile even with only past appointments', () => {
    cy.task('stubGetAppointmentsPast')
    cy.signIn()
    Page.verifyOnPage(DashboardPage)
    cy.get('#appointments-tile').should('exist')
    cy.get('[data-qa="appointment-tile-no-content"]').contains("There's no future appointments to show you.")
  })

  it('Should see the profile tile on dashboard', () => {
    cy.task('stubGetAppointments')
    cy.signIn()
    Page.verifyOnPage(DashboardPage)
    cy.get('#profile-tile').contains('Keep your personal information up to date.')
  })
})
