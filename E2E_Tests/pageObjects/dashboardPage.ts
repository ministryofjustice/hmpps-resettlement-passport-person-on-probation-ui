import { expect, type Locator, type Page } from '@playwright/test'

export default class DashboardPage {
    private page: Page;

    readonly pageHeader: Locator;
  
    constructor(page: Page) {
      this.page = page;
      this.pageHeader = page.locator('h2:has-text("Plan your future")');
  
    }
  
    async shouldFindTitle() {
      await expect(this.pageHeader).toBeVisible();
    }
}