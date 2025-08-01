// import CookiesPage from '../pages/cookies'
// import AccessibilityPage from '../pages/accessibility'
import StartPage from '../pages/start'
import Page from '../pages/page'

context('Static pages', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('Should see the start page', () => {
    Page.verifyOnPage(StartPage).runAxe()
  })

  // Below test cases are commented out as they are not currently functional - require contentful access token to work.
  // it('Should see the privacy policy link', () => {
  //   cy.get('[data-qa="privacy-policy-link"]').should('have.attr', 'href').and('include', '/privacy')
  //   cy.get('[data-qa="privacy-policy-link"]').click()
  //   cy.contains('Privacy notice')
  // })
  //
  // it('Should see the cookies page link', () => {
  //   cy.get('[data-qa="cookies-link"]').should('have.attr', 'href').and('include', '/cookies')
  //   cy.get('[data-qa="cookies-link"]').click()
  //   Page.verifyOnPage(CookiesPage).runAxe()
  // })
  //
  // it('Should see the accessibility page link', () => {
  //   cy.get('[data-qa="accessibility-link"]').should('have.attr', 'href').and('include', '/accessibility')
  //   cy.get('[data-qa="accessibility-link"]').click()
  //   Page.verifyOnPage(AccessibilityPage).runAxe()
  // })
})
