import logAccessibilityViolations from '../support/logAccessibilityViolations'

export type PageElement = Cypress.Chainable<JQuery>

export default abstract class Page {
  static verifyOnPage<T>(constructor: new () => T): T {
    return new constructor()
  }

  protected constructor(private readonly title: string) {
    this.checkOnPage()
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

export class Profile extends Page {
  constructor() {
    super('Profile')
  }
}

export class TimedOutPage extends Page {
  constructor() {
    super('You have been signed out')
  }
}

export class SettingsPage extends Page {
  constructor() {
    super('Settings')
  }
}

export class LicenceConditionsDetailsPage extends Page {
  constructor() {
    super('Map of the area you cannot enter')
  }
}

export class FeedbackPage extends Page {
  constructor() {
    super('Plan your future feedback')
  }
}

export class QuestionsPage extends Page {
  constructor() {
    super('Send us feedback')
  }
}

export class VerificationPage extends Page {
  constructor() {
    super('Sample text')
  }
}

export class TodoListPage extends Page {
  constructor() {
    super('To-do list')
  }
}

export class TodoListAddPage extends Page {
  constructor() {
    super('Add a to-do list item')
  }
}

export class TodoListEditPage extends Page {
  constructor() {
    super('Edit a to-do list item')
  }
}
