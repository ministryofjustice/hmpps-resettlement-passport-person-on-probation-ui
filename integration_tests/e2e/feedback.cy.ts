import StartPage from '../pages/start'
import Page, { FeedbackPage, QuestionsPage } from '../pages/page'

context('Feedback', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubCreateTicket')
    cy.visit('/')
  })

  it('Should be able to submit feedback', () => {
    Page.verifyOnPage(StartPage)
    cy.get('[data-qa="feedback-link"]').click()

    // start feedback
    Page.verifyOnPage(FeedbackPage)
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
    cy.get(':nth-child(1) > .govuk-summary-list__value').contains('Satisfied')
    cy.get(':nth-child(2) > .govuk-summary-list__value').contains('This is some feedback')
    cy.get(':nth-child(3) > .govuk-summary-list__value').contains('Testname Testlastname')
    cy.get(':nth-child(4) > .govuk-summary-list__value').contains('test@test.com')

    cy.get('[data-qa="feedback-review-btn"]').click()

    // success
    cy.get('[data-qa="feedback-success-panel"]').should('exist')
    cy.get('[data-qa="feedback-end-return-link"]').click()

    Page.verifyOnPage(StartPage)
  })

  it('Should be able to change answers', () => {
    Page.verifyOnPage(StartPage)
    cy.get('[data-qa="feedback-link"]').click()
    Page.verifyOnPage(FeedbackPage)

    // start feedback
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
    cy.get(':nth-child(1) > .govuk-summary-list__value').contains('Satisfied')
    cy.get(':nth-child(2) > .govuk-summary-list__value').contains('This is some feedback')
    cy.get(':nth-child(3) > .govuk-summary-list__value').contains('Testname Testlastname')
    cy.get(':nth-child(4) > .govuk-summary-list__value').contains('test@test.com')

    // change score
    cy.get(':nth-child(1) > .govuk-summary-list__actions > .govuk-link').click()
    cy.get('#score-3').click()
    cy.get('[data-qa="feedback-questions-btn"]').click()
    cy.get('[data-qa="feedback-review-page-title"]').contains('Check your answers')
    cy.get(':nth-child(1) > .govuk-summary-list__value').contains('Neither satisfied nor dissatisfied')

    // change details
    cy.get(':nth-child(2) > .govuk-summary-list__actions > .govuk-link').click()
    cy.get('#details').type('This is some different feedback')
    cy.get('[data-qa="feedback-questions-btn"]').click()
    cy.get('[data-qa="feedback-review-page-title"]').contains('Check your answers')
    cy.get(':nth-child(2) > .govuk-summary-list__value').contains('This is some different feedback')

    // change name
    cy.get(':nth-child(3) > .govuk-summary-list__actions > .govuk-link').click()
    cy.get('#name').clear()
    cy.get('[data-qa="feedback-questions-btn"]').click()
    cy.get('[data-qa="feedback-review-page-title"]').contains('Check your answers')
    cy.get(':nth-child(3) > .govuk-summary-list__value').should('have.value', '')

    // change email
    cy.get(':nth-child(4) > .govuk-summary-list__actions > .govuk-link').click()
    cy.get('#email').clear()
    cy.get('[data-qa="feedback-questions-btn"]').click()
    cy.get('[data-qa="feedback-review-page-title"]').contains('Check your answers')
    cy.get(':nth-child(4) > .govuk-summary-list__value').should('have.value', '')
  })

  it('Should validate feedback input', () => {
    Page.verifyOnPage(StartPage)
    cy.get('[data-qa="feedback-link"]').click()

    Page.verifyOnPage(FeedbackPage)
    // start feedback
    cy.get('[data-qa="feedback-start-btn"]').click()

    // enter nothing and submit
    cy.get('[data-qa="feedback-questions-page-title"]').contains('Send us feedback')
    cy.get('[data-qa="feedback-questions-btn"]').click()

    // should only validate score
    cy.contains('There is a problem')
    cy.should('not.contain', 'Enter an email address in the correct format')
    cy.contains('Select how satisfied you are with the service')

    // enter incorrect email (optional field)
    cy.get('#email').type('a')
    cy.get('[data-qa="feedback-questions-btn"]').click()
    cy.contains('Enter an email address in the correct format')
    cy.contains('Select how satisfied you are with the service')
  })

  it('Should strip unsafe html input', () => {
    Page.verifyOnPage(StartPage)
    cy.get('[data-qa="feedback-link"]').click()
    Page.verifyOnPage(FeedbackPage)

    // start feedback
    cy.get('[data-qa="feedback-start-btn"]').click()

    // type unsafe answers
    cy.get('[data-qa="feedback-questions-page-title"]').contains('Send us feedback')
    cy.get('#score-2').click()
    cy.get('#details').type('This is some <script>alert(hi)</script>feedback')
    cy.get('#name').type('Testname<script>alert(hi)</script> Testlastname')
    cy.get('#email').type('test@test.com')
    cy.get('[data-qa="feedback-questions-btn"]').click()

    // check answers
    cy.get('[data-qa="feedback-review-page-title"]').contains('Check your answers')
    cy.get(':nth-child(1) > .govuk-summary-list__value').contains('Satisfied')
    cy.get(':nth-child(2) > .govuk-summary-list__value').contains('This is some feedback')
    cy.get(':nth-child(3) > .govuk-summary-list__value').contains('Testname Testlastname')
    cy.get(':nth-child(4) > .govuk-summary-list__value').contains('test@test.com')

    cy.get('[data-qa="feedback-review-btn"]').click()

    // success
    cy.get('[data-qa="feedback-success-panel"]').should('exist')
  })

  it('should be accessible', () => {
    Page.verifyOnPage(StartPage)
    cy.get('[data-qa="feedback-link"]').click()
    Page.verifyOnPage(FeedbackPage).runAxe()
    cy.get('[data-qa="feedback-start-btn"]').click()
    Page.verifyOnPage(QuestionsPage).runAxe()
  })
})
