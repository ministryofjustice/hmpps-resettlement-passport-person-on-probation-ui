import DashboardPage from '../pages/dashboard'
import Page from '../pages/page'

context('Dashboard', () => {
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
    cy.signIn()

    // should be on the dashboard
    Page.verifyOnPage(DashboardPage)

    // licence-conditions tile should exist and clickable
    cy.get('#licence-conditions-tile').should('exist')
    cy.get('#licence-conditions-tile-body').contains('Your licence conditions expire on 12 July 2023')
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

  it('Should see the profile tile on dashboard', () => {
    cy.signIn()
    Page.verifyOnPage(DashboardPage)
    cy.get('#profile-tile').contains('Keep your personal information up to date.')
  })
})
