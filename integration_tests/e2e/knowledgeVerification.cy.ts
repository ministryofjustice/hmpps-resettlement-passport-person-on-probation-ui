import Page, { VerificationPage } from '../pages/page'
import OverviewPage from '../pages/overview'

context('Knowledge verification', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubGetPopUserOtp')
    cy.task('stubGetPopUserDetails')
    cy.task('stubHmppsToken')
  })

  it('should redirect to overview if user is already verified', () => {
    cy.task('stubGetPopUserByUrn')
    cy.signIn()
    cy.visit('/sign-up/verify')

    Page.verifyOnPage(OverviewPage)
  })

  it('Should show errors for missing fields', () => {
    cy.signIn()
    cy.visit('/sign-up/verify')
    Page.verifyOnPage(VerificationPage)
    cy.get('#submit').click()

    cy.get('.govuk-error-summary .govuk-list li').eq(0).should('contain.text', 'Enter your first name')
    cy.get('.govuk-error-summary .govuk-list li').eq(1).should('contain.text', 'Enter your last name')
    cy.get('.govuk-error-summary .govuk-list li')
      .eq(2)
      .should('contain.text', 'Enter a date of birth in the correct format')
    cy.get('.govuk-error-summary .govuk-list li').eq(3).should('contain.text', 'Enter your prison number')

    cy.get('#first-name-error').should('be.visible')
    cy.get('#last-name-error').should('be.visible')
    cy.get('#dob-error').should('be.visible')
    cy.get('#prisoner-number-error').should('be.visible')
  })

  function enterJohnSmithDetails() {
    cy.get('#first-name').type('John')
    cy.get('#last-name').type('Smith')
    cy.get('#dob-day').type('24')
    cy.get('#dob-month').type('10')
    cy.get('#dob-year').type('1982')
    cy.get('#prisoner-number').type('G4161UF')
  }

  it('Should show error for future date of birth', () => {
    cy.signIn()
    cy.visit('/sign-up/verify')
    Page.verifyOnPage(VerificationPage)

    const today = new Date()

    cy.get('#first-name').type('John')
    cy.get('#last-name').type('Smith')
    cy.get('#dob-day').type(String(today.getDate() + 1))
    cy.get('#dob-month').type(String(today.getMonth() + 1))
    cy.get('#dob-year').type(String(today.getFullYear()))
    cy.get('#prisoner-number').type('G4161UF')
    cy.get('#submit').click()
    cy.get('.govuk-error-summary').should('contain.text', 'The date of birth must be in the past')
    cy.get('#dob-error').should('be.visible')
  })

  it('Should show error when user not matched', () => {
    cy.signIn()
    cy.visit('/sign-up/verify')
    cy.task('stubVerifyNotFound')
    Page.verifyOnPage(VerificationPage)

    enterJohnSmithDetails()
    cy.get('#submit').click()
    cy.get('.govuk-error-summary').should('contain.text', 'These details could not be matched against our records')
  })

  it('Should send user on to overview page if verification is successful', () => {
    cy.signIn()
    cy.visit('/sign-up/verify')
    cy.task('stubVerifySuccess')
    Page.verifyOnPage(VerificationPage)

    enterJohnSmithDetails()
    cy.task('stubGetPopUserByUrn')
    cy.get('#submit').click()

    Page.verifyOnPage(OverviewPage)
  })
})
