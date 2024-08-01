import { expect, type Locator, type Page } from '@playwright/test'

export default class DocumentsPage {
  private page: Page;

  readonly pageHeader: Locator;
  readonly viewDocumentLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageHeader = page.locator('h1', { hasText: 'Your documents'});
    this.viewDocumentLink = page.getByText('View document');
  }

  async shouldFindTitle() {
    await expect(this.pageHeader).toBeVisible();
  }

}