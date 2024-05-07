import { expect, Locator, Page } from "@playwright/test";

export default class GovOneCreatedAccount {
  readonly page: Page;
  readonly continue: Locator;
  readonly gettingHeader: Locator
  

  constructor(page: Page) {
    this.page = page
    this.continue = page.locator('//*[@id="form-tracking"]/button')
    this.gettingHeader = page.locator('h1', { hasText: 'You’ve created your GOV.UK One Login' })
  }

  async shouldFindTitle() {
    await expect(this.gettingHeader).toBeVisible()
  }
}
