import { expect, type Locator, type Page } from '@playwright/test'

export default class HomePage {
  private page: Page;

  readonly gettingStartedHeader: Locator;

  constructor(page: Page) {
    this.page = page;
    this.gettingStartedHeader = page.locator('h1', { hasText: 'Check your appointments and licence conditions' });
  }

  private HomePageElements = {
    startButton: '[data-qa="start-btn"]',
  }

  async clickStart() {
    await this.page.locator(this.HomePageElements.startButton).click();
  }

  async shouldFindTitle() {
    await expect(this.gettingStartedHeader).toBeVisible();
  }
}
