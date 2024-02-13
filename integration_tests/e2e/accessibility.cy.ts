context('Accessibility', () => {
  before(() => {
    cy.task('reset')
  })

  it('Check entire page for a11y issues', () => {
    cy.visit('/')
    cy.injectAxe()
    cy.checkA11y()
  })
})
