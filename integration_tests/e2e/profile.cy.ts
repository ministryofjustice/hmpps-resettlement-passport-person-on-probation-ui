context('Profile', () => {
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

  it('Should see the profile tile on dashboard', () => {
    cy.signIn()
    cy.get('#profile-tile').contains('Keep your personal information up to date.')
  })

  it('Should be able to see profile page and profile data', () => {
    cy.signIn()

    // click sub navigation menu for profile
    cy.get(':nth-child(4) > .moj-sub-navigation__link').click()
    cy.get('.govuk-heading-xl').contains('Profile')

    // fullname
    cy.get('.profile-name').contains('John Paul Smith')
    // Email address
    cy.get('.profile-email').contains('Not available')
    // Phone
    cy.get('.profile-phone').contains('Not available')
  })
})
