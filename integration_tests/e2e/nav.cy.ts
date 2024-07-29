import Page from '../pages/page'
import StartPage from '../pages/start'
import { FeatureFlagKey } from '../../server/services/featureFlags'

context('Nav', () => {
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
    Page.verifyOnPage(StartPage)
    cy.task('restoreFlags')
  })

  it('Should not see nav link for appointments on any page when appointments disabled', () => {
    cy.signIn()
    cy.task('disableFlag', FeatureFlagKey.VIEW_APPOINTMENTS)
    // home
    cy.get('[data-qa="home-nav-link"]').click()
    cy.get('[data-qa="appointments-nav-link"]').should('not.be.visible')
    // licence-conditions
    cy.get('[data-qa="licence-conditions-nav-link"]').click()
    cy.get('[data-qa="appointments-nav-link"]').should('not.be.visible')
    // profile
    cy.get('[data-qa="profile-nav-link"]').click()
    cy.get('[data-qa="appointments-nav-link"]').should('not.be.visible')
    // settings
    cy.get('[data-qa="settings-nav-link"]').click()
    cy.get('[data-qa="appointments-nav-link"]').should('not.be.visible')
  })

  it('Should see nav link for appointments on any page when appointments enabled', () => {
    cy.signIn()
    // home
    cy.get('[data-qa="home-nav-link"]').click()
    cy.get('[data-qa="appointments-nav-link"]').should('be.visible')
    // licence-conditions
    cy.get('[data-qa="licence-conditions-nav-link"]').click()
    cy.get('[data-qa="appointments-nav-link"]').should('be.visible')
    // profile
    cy.get('[data-qa="profile-nav-link"]').click()
    cy.get('[data-qa="appointments-nav-link"]').should('be.visible')
    // settings
    cy.get('[data-qa="settings-nav-link"]').click()
    cy.get('[data-qa="appointments-nav-link"]').should('be.visible')
  })

  it('Should not see nav link for documents on any page when documents disabled', () => {
    cy.signIn()
    cy.task('disableFlag', FeatureFlagKey.DOCUMENTS)
    // home
    cy.get('[data-qa="home-nav-link"]').click()
    cy.get('[data-qa="documents-nav-link"]').should('not.be.visible')
    // licence-conditions
    cy.get('[data-qa="licence-conditions-nav-link"]').click()
    cy.get('[data-qa="documents-nav-link"]').should('not.be.visible')
    // profile
    cy.get('[data-qa="profile-nav-link"]').click()
    cy.get('[data-qa="documents-nav-link"]').should('not.be.visible')
    // settings
    cy.get('[data-qa="settings-nav-link"]').click()
    cy.get('[data-qa="documents-nav-link"]').should('not.be.visible')
  })

  it('Should see nav link for documents on any page when documents enabled', () => {
    cy.signIn()
    // home
    cy.get('[data-qa="home-nav-link"]').click()
    cy.get('[data-qa="documents-nav-link"]').should('be.visible')
    // licence-conditions
    cy.get('[data-qa="licence-conditions-nav-link"]').click()
    cy.get('[data-qa="documents-nav-link"]').should('be.visible')
    // profile
    cy.get('[data-qa="profile-nav-link"]').click()
    cy.get('[data-qa="documents-nav-link"]').should('be.visible')
    // settings
    cy.get('[data-qa="settings-nav-link"]').click()
    cy.get('[data-qa="documents-nav-link"]').should('be.visible')
  })
})
