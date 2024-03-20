Cypress.Commands.add('signIn', (options = { failOnStatusCode: true }) => {
  cy.request('/dashboard')
  return cy.task('getSignInUrl', options.nonce).then((url: string) => {
    cy.visit(url, options)
    return cy.task('verifyJwtAssertionForToken')
  })
})
