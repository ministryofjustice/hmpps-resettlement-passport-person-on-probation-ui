import HomePage from "../pages/home"
import Page from "../pages/page"

context('Feedback', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubCreateTicket')
    cy.visit('/')
  })

  it('Should be able to give feedback', () => {
    Page.verifyOnPage(HomePage)
    cy.get('[data-qa="feedback-link"]')

    cy.get('[data-qa="feedback-page-title"]').contains('Plan your future feedback')
    cy.get('[data-qa="feedback-start-btn"]').click()


    cy.get('[data-qa="feedback-questions-page-title"]').contains('Send us feedback')
    cy.get('[data-qa="feedback-questions-btn"]').click()

    cy.get('[data-qa="feedback-review-page-title"]').contains('Check your answers')
    cy.get('[data-qa="feedback-review-btn"]').click()


    cy.get('[feedback-success-panel"]').contains('Thank you')
    cy.get('[data-qa="feedback-end-return-link"]').click()

    Page.verifyOnPage(HomePage)
  })
})
