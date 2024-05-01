import HomePage from '../pages/home'
import Page from '../pages/page'

context('Feedback', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubCreateTicket')
    cy.visit('/')
  })

  it('Should be able to submit feedback', () => {
    Page.verifyOnPage(HomePage)
    cy.get('[data-qa="feedback-link"]').click()

    // start feedback
    cy.get('[data-qa="feedback-page-title"]').contains('Plan your future feedback')
    cy.get('[data-qa="feedback-start-btn"]').click()

    // type answers
    cy.get('[data-qa="feedback-questions-page-title"]').contains('Send us feedback')
    cy.get('#score-2').click()
    cy.get('#details').type('This is some feedback')
    cy.get('#name').type('Testname Testlastname')
    cy.get('#email').type('test@test.com')
    cy.get('[data-qa="feedback-questions-btn"]').click()

    // check answers
    cy.get('[data-qa="feedback-review-page-title"]').contains('Check your answers')
    cy.get(':nth-child(1) > .govuk-summary-list__value').contains('4')
    cy.get(':nth-child(2) > .govuk-summary-list__value').contains('This is some feedback')
    cy.get(':nth-child(3) > .govuk-summary-list__value').contains('Testname Testlastname')
    cy.get(':nth-child(4) > .govuk-summary-list__value').contains('test@test.com')

    cy.get('[data-qa="feedback-review-btn"]').click()

    // success
    cy.get('[data-qa="feedback-success-panel"]').should('exist')
    cy.get('[data-qa="feedback-end-return-link"]').click()

    Page.verifyOnPage(HomePage)
  })
})
