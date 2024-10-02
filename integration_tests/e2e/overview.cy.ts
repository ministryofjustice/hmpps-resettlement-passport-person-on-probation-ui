import OverviewPage from '../pages/overview'
import Page from '../pages/page'
import { FeatureFlagKey } from '../../server/services/featureFlags'

context('Overview', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubForDefaultLoggedInUser')
  })

  afterEach(() => {
    cy.task('restoreFlags')
  })

  it('Should render alert box for todays appointments', () => {
    cy.task('stubGetAppointmentsToday')
    cy.signIn()
    Page.verifyOnPage(OverviewPage)
    cy.get('.govuk-notification-banner__heading').contains('You have 2 appointments today')
  })

  it('Should not render alert box for todays appointments when flag disabled', () => {
    cy.task('disableFlag', FeatureFlagKey.VIEW_APPOINTMENTS)
    cy.task('stubGetAppointmentsToday')
    cy.signIn()
    Page.verifyOnPage(OverviewPage)
    cy.get('.govuk-notification-banner__heading').should('not.exist')
  })

  it('Should render alert box for tomorrows appointments', () => {
    cy.task('stubGetAppointments')
    cy.signIn()
    Page.verifyOnPage(OverviewPage)
    cy.get('.govuk-notification-banner__heading').contains('You have 2 appointments tomorrow')
  })

  it('Should be able to see the Licence Conditions Tile', () => {
    cy.task('stubGetAppointments')
    cy.signIn()
    Page.verifyOnPage(OverviewPage)

    // licence-conditions tile should exist and clickable
    cy.get('#licence-conditions-tile').should('exist')
    cy.get('#licence-conditions-tile-body').contains('Your licence conditions expire on 12 July 2199')
  })

  it('Should see alternative text on Licence Conditions Tile when licence conditions missing', () => {
    cy.task('stubGetAppointments')
    cy.task('stubGetLicenceConditionsMissing')
    cy.signIn()
    Page.verifyOnPage(OverviewPage)
    cy.get('#licence-conditions-tile-body').contains(
      'We cannot show your licence conditions. Ask your probation officer for details.',
    )
  })

  it('Should see alert box when licence conditions expired', () => {
    cy.task('stubGetAppointments')
    cy.task('stubGetLicenceConditionsExpired')
    cy.signIn()
    Page.verifyOnPage(OverviewPage)
    cy.get('.govuk-notification-banner__heading').contains('Your licence conditions ended on 12 July 1999.')
    cy.get('#licence-conditions-tile-body').contains('You do not have any licence conditions.')
  })

  it('Should see alert box when licence conditions changed', () => {
    cy.task('stubGetAppointments')
    cy.task('stubGetLicenceConditionsChanged')
    cy.signIn()
    Page.verifyOnPage(OverviewPage)
    cy.get('.govuk-notification-banner__heading').contains('Your licence conditions have been updated.')
  })

  it('Should not see alert box for licence conditions changed when recall', () => {
    cy.task('stubGetLicenceConditionsChanged')
    cy.task('stubGetPopUserDetailsWithRecall')
    cy.signIn()

    Page.verifyOnPage(OverviewPage)
    cy.get('.govuk-notification-banner__heading').should('not.exist')
  })

  it('Should see only 1 alert message when licence conditions changed and expired', () => {
    cy.task('stubGetAppointments')
    cy.task('stubGetLicenceConditionsChangedAndExpired')
    cy.signIn()
    Page.verifyOnPage(OverviewPage)
    cy.get('.govuk-notification-banner__heading').contains('Your licence conditions ended on 12 July 1999.')
    cy.get('alert-box-licence-changed-msg').should('not.exist')
  })

  it('Should be able to see the Appointments Tile', () => {
    cy.task('stubGetAppointments')
    cy.signIn()

    // should be on the overview
    Page.verifyOnPage(OverviewPage)

    // appointment tile should exist and clickable
    cy.get('#appointments-tile').should('exist')
    cy.get('#next-appointment-title').contains('This is a future appointment')
  })

  it('Should not be able to see the Appointments Tile when flag disabled', () => {
    cy.task('disableFlag', FeatureFlagKey.VIEW_APPOINTMENTS)
    cy.task('stubGetAppointments')
    cy.signIn()

    Page.verifyOnPage(OverviewPage)

    cy.get('[data-qa="appointments-nav-link"]').should('not.be.visible')
    cy.get('#appointments-tile').should('not.exist')
    cy.get('#next-appointment-title').should('not.exist')
  })

  it('Should be able to see the Appointments Tile even with no appointments', () => {
    cy.task('stubGetAppointmentsMissing')
    cy.signIn()
    Page.verifyOnPage(OverviewPage)
    cy.get('#appointments-tile').should('exist')
    cy.get('[data-qa="appointment-tile-no-content"]').contains("There's no future appointments to show you.")
  })

  it('Should be able to see the Appointments Tile even with only past appointments', () => {
    cy.task('stubGetAppointmentsPast')
    cy.signIn()
    Page.verifyOnPage(OverviewPage)
    cy.get('#appointments-tile').should('exist')
    cy.get('[data-qa="appointment-tile-no-content"]').contains("There's no future appointments to show you.")
  })

  it('Should see the profile tile on overview', () => {
    cy.task('stubGetAppointments')
    cy.signIn()
    Page.verifyOnPage(OverviewPage)
    cy.get('#profile-tile').contains('Manage your personal and contact information. You must keep this up-to-date.')
  })

  it('Should see the documents tile on overview when documents flag is enabled', () => {
    cy.task('stubGetAppointments')
    cy.signIn()
    Page.verifyOnPage(OverviewPage)
    cy.get('#documents-tile').contains('Access documents saved for you.')
  })

  it('Should not see the documents tile on overview when documents flag is disabled', () => {
    cy.task('stubGetAppointments')
    cy.task('disableFlag', FeatureFlagKey.DOCUMENTS)
    cy.signIn()
    Page.verifyOnPage(OverviewPage)
    cy.get('#documents-tile').should('not.exist')
  })

  it('Should see the todo tile on overview when todo flag is enabled', () => {
    cy.task('stubGetAppointments')
    cy.task('stubGetTodoTasks')
    cy.signIn()
    Page.verifyOnPage(OverviewPage)
    cy.get('#todo-tile p')
      .eq(1)
      .should(tile => expect(tile.text().trim()).to.match(/You have\s*2 tasks on your list\./))
  })

  it('Should not see the todo tile on overview when todo flag is disabled', () => {
    cy.task('stubGetAppointments')
    cy.task('disableFlag', FeatureFlagKey.TODO_LIST)
    cy.signIn()
    Page.verifyOnPage(OverviewPage)
    cy.get('#todo-tile').should('not.exist')
  })

  it('Shows personalised content block', () => {
    cy.task('stubGetAppointments')
    cy.signIn()
    Page.verifyOnPage(OverviewPage)
    cy.get('#personalised-links').should('contain.text', 'For you')
    cy.get('#personalised-links')
      .find('ul')
      .should(items => expect(items.length).gte(1))
  })

  it('Shows all resettlement content block', () => {
    cy.task('stubGetAppointments')
    cy.signIn()
    Page.verifyOnPage(OverviewPage)
    cy.get('#content-links').should('contain.text', 'All resettlement topics')
    cy.get('#content-links')
      .find('ul')
      .should(items => expect(items.length).gte(1))
  })

  it('Should be accessible', () => {
    cy.task('stubGetAppointments')
    cy.signIn()
    Page.verifyOnPage(OverviewPage).runAxe()
  })
})
