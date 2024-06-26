import { expect, type Locator, type Page } from '@playwright/test'

export default class PyfFooter {
  private page: Page;

  readonly pageHeader: Locator;
  readonly accessibilityStatementLink: Locator;
  readonly cookiesLink: Locator;
  readonly giveFeedbackLink: Locator;
  readonly privacyPolicyLink: Locator;
  

  constructor(page: Page) {
    this.page = page;
    this.pageHeader = page.locator('h1');
    this.accessibilityStatementLink = page.locator('[data-qa="accessibility-link"]');
    this.cookiesLink = page.locator('[data-qa="cookies-link"]');
    this.giveFeedbackLink = page.locator('[data-qa="feedback-link"]');
    this.privacyPolicyLink = page.locator('[data-qa="privacy-policy-link"]');
  }

  async shouldFindTitle() {
    await expect(this.pageHeader).toBeVisible();
  }

}