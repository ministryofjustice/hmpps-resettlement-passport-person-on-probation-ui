import DocumentsPage from '../pages/documents'
import Page from '../pages/page'
import OverviewPage from '../pages/overview'
import { FeatureFlagKey } from '../../server/services/featureFlags'
import ErrorPage from '../pages/errorPage'

context('Documents', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubForDefaultLoggedInUser')
  })

  afterEach(() => {
    cy.task('restoreFlags')
  })

  it('Should redirect to overview when documents disabled', () => {
    cy.task('stubGetAppointments')
    cy.task('disableFlag', FeatureFlagKey.DOCUMENTS)
    cy.signIn()
    cy.visit('/documents')
    Page.verifyOnPage(OverviewPage)
  })

  it('Should display documents table', () => {
    cy.task('stubGetDocuments')
    cy.signIn()
    cy.visit('/documents')
    Page.verifyOnPage(DocumentsPage)
    cy.get('.govuk-table__body > tr > td').eq(0).should('contain.text', 'conditions.pdf')
    cy.get('.govuk-table__body > tr > td').eq(1).should('contain.text', 'Licence conditions')
    cy.get('.govuk-table__body > tr > td > a')
      .should('have.text', 'View document')
      .should('have.attr', 'href', '/documents/licence-conditions.pdf')
  })

  it('Should redirect to error page when download fails', () => {
    cy.signIn()
    cy.task('stubGetDocumentError')

    cy.visit('/documents/licence-conditions.pdf', { failOnStatusCode: false })
    Page.verifyOnPage(ErrorPage)
  })

  it('Should download document', () => {
    cy.signIn()
    cy.task('stubGetDocument')
    cy.request('/documents/licence-conditions.pdf').should(response => {
      expect(response.headers['content-type']).eq('application/pdf')
      expect(response.body).eq('fake pdf content')
    })
  })

  it('should be accessible', () => {
    cy.signIn()
    cy.task('stubGetDocument')
    cy.visit('/documents')
    Page.verifyOnPage(DocumentsPage).runAxe()
  })
})
