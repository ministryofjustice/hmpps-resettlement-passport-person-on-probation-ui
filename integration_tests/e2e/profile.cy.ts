import Page, { Profile } from '../pages/page'

context('Profile', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubForDefaultLoggedInUser')
  })

  it('Should be able to see profile page and profile data', () => {
    cy.signIn()

    // click sub navigation menu for profile
    cy.get('[data-qa="profile-nav-link"]').click()
    Page.verifyOnPage(Profile)

    // fullname
    cy.get('.profile-name').contains('John Paul Smith')
    // Email address
    cy.get('.profile-email').contains('john@test.com')
    // Mobile
    cy.get('.profile-mobile').contains('0798654321')
  })

  it('Should be accessible', () => {
    cy.signIn()

    // click sub navigation menu for profile
    cy.get('[data-qa="profile-nav-link"]').click()
    Page.verifyOnPage(Profile).runAxe()
  })
})
