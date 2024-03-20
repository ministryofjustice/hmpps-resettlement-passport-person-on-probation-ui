import LicencePage from '../../pages/licence'
import Page from '../../pages/page'

context('Licence conditions', () => {
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
    cy.contains('You have been logged out.')
  })

  it('Should see licence conditions', () => {
    cy.signIn()

    // click sub navigation menu for licence conditions
    cy.get(':nth-child(3) > .moj-sub-navigation__link').click()
    Page.verifyOnPage(LicencePage)

    // date start and end should be visivle
    cy.get('#licence-dates').contains('20 August 2023 - 12 July 2023')

    // standard conditions should be visible
    cy.contains('1. Be of good behaviour and not behave in a way which undermines the purpose of the licence period.')

    // additional conditions should be visible
    cy.contains(
      '2. Not to enter the area of Leeds City Centre, as defined by the attached map, without the prior approval of your supervising officer.',
    )
  })

  it('Should see licence conditions details', () => {
    cy.signIn()
    // click sub navigation menu for licence conditions
    cy.get(':nth-child(3) > .moj-sub-navigation__link').click()
    Page.verifyOnPage(LicencePage)

    // additional conditions should be visible
    cy.get('#condition-image-1008-link').click()

    // image should be present
    cy.get('#licence-conditions-map')
      .should('be.visible')
      // "naturalWidth" and "naturalHeight" are set when the image loads
      .and(img => {
        expect((img[0] as HTMLImageElement).naturalWidth).to.be.greaterThan(0)
      })
    // licence text should be present
    cy.get('#licence-conditions-text').contains(
      'Not to enter the area of Leeds City Centre, as defined by the attached map, without the prior approval of your supervising officer.',
    )
    // and should be able to go back
    cy.get('#back-licence-details-link').click()
    Page.verifyOnPage(LicencePage)
  })

  it('Should be able to see the Licence Conditions Tile', () => {
    cy.signIn()

    // should be on the dashboard
    cy.contains('John Smith')

    // licence-conditions tile should exist and clickable
    cy.get('#licence-conditions-tile').should('exist')
    cy.get('#licence-conditions-tile-body').contains('Your licence conditions expire on 12 July 2023')
  })
})
