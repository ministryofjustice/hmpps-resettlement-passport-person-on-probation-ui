import { expect, type Locator, type Page } from '@playwright/test'

export default class SettingsPage {
  private page: Page;

  readonly pageHeader: Locator;
  readonly govOneLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageHeader = page.locator('h1', { hasText: 'Settings'});
    this.govOneLink = page.locator('[data-qa="change-onelogin-link"]');
  }

  async shouldFindTitle() {
    await expect(this.pageHeader).toBeVisible();
  }

}