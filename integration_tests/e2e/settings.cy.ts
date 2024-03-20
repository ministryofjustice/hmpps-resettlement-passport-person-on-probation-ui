context('Settings', () => {
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

  it('Should be able to see settings page and links', () => {
    cy.signIn()

    // click sub navigation menu for profile
    cy.get(':nth-child(5) > .moj-sub-navigation__link').click()
    cy.get('.govuk-heading-xl').contains('Settings')

    // change email link is set correctly
    cy.get('[data-qa="change-email-link"]')
      .should('have.attr', 'href')
      .and('include', 'http://localhost:9091/govukOneLoginHome/enter-password?type=changeEmail')

    // change password link is set correctly
    cy.get('[data-qa="change-pwd-link"]')
      .should('have.attr', 'href')
      .and('include', 'http://localhost:9091/govukOneLoginHome/enter-password?type=changePassword')

    // change phone link is set correctly
    cy.get('[data-qa="change-phone-link"]')
      .should('have.attr', 'href')
      .and('include', 'http://localhost:9091/govukOneLoginHome/enter-password?type=changePhoneNumber')
  })
})
