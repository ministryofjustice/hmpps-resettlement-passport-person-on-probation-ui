import { expect, type Locator, type Page } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright';

export default class HomePage {
  private page: Page;
  readonly gettingStartedHeader: Locator;
  readonly contentsList: Locator;
  readonly pageContentsTitle: Locator;


  constructor(page: Page) {
    this.page = page;
    this.gettingStartedHeader = page.locator('h1', { hasText: 'Resettle after prison' });
    this.pageContentsTitle = page.locator('//*[@id="main-content"]/div[2]/div/h2');
    this.contentsList = page.locator('//*[@id="main-content"]/div[1]/div/aside/nav/ol');
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

  async scanPageAccessibilty() {
    const page = this.page
    var accessibilityScanResults = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();
    console.log('axe is running')
    console.log(accessibilityScanResults.violations);
    expect(accessibilityScanResults.violations).toEqual([]);
  }
}
