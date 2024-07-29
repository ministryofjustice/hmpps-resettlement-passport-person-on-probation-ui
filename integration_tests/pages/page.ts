import logAccessibilityViolations from '../support/logAccessibilityViolations'

export type PageElement = Cypress.Chainable<JQuery>

export default abstract class Page {
  static verifyOnPage<T>(constructor: new () => T): T {
    return new constructor()
  }

  protected constructor(
    private readonly title: string,
    private readonly options: { axeTest?: boolean } = {
      axeTest: true,
    },
  ) {
    this.checkOnPage()

    if (options.axeTest) {
      this.runAxe()
    }
  }

  checkOnPage(): void {
    cy.get('h1').contains(this.title)
  }

  runAxe = (): void => {
    cy.injectAxe()
    cy.checkA11y(
      null,
      {
        includedImpacts: ['critical', 'serious'],
      },
      logAccessibilityViolations,
      false, // skipFailures
    )
  }
}
