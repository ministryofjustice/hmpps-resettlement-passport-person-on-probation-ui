context('Static pages', () => {
  beforeEach(() => {
    cy.task('reset')
  })

  it('Should see the start page', () => {
    cy.contains('Use this service after leaving prison to view:')
  })

  it('Should see the privacy policy link', () => {
    cy.get('[data-qa="privacy-policy-link"]')
      .should('have.attr', 'href')
      .and('include', 'https://www.gov.uk/help/privacy-notice')
  })

  it('Should see the cookies page link', () => {
    cy.get('[data-qa="cookies-link"]').should('have.attr', 'href').and('include', '/cookies')

    cy.get('[data-qa="cookies-link"]').click()
    cy.contains('Cookies')
  })
})
