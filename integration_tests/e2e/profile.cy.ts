import StartPage from '../pages/start'
import Page from '../pages/page'

context('Profile', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubGetPopUserOtp')
    cy.task('stubGetPopUserDetails')
    cy.task('stubHmppsToken')
    cy.task('stubGetLicenceConditions')
    cy.task('stubGetPopUserByUrn')
    cy.task('stubGetAppointments')
  })

  afterEach(() => {
    cy.get('[data-qa="signOut"]').click()
    Page.verifyOnPage(StartPage)
  })

  it('Should be able to see profile page and profile data', () => {
    cy.signIn()

    // click sub navigation menu for profile
    cy.get(':nth-child(4) > .moj-sub-navigation__link').click()
    cy.get('.govuk-heading-xl').contains('Profile')

    // fullname
    cy.get('.profile-name').contains('John Paul Smith')
    // Email address
    cy.get('.profile-email').contains('john@test.com')
    // Mobile
    cy.get('.profile-mobile').contains('0798654321')
  })
})
