import { expect, type Locator, type Page } from '@playwright/test'

export default class CompleteAccourtPage {
  private page: Page

  readonly pageHeader: Locator
  readonly enterFirstTimeIdCode: Locator;
  readonly enterDay: Locator;
  readonly enterMonth: Locator;
  readonly enterYear: Locator;
  readonly continue: Locator;
  readonly warning: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageHeader = page.locator('h1', { hasText: 'Complete your account setup securely'});
    this.enterFirstTimeIdCode = page.locator('//*[@id="otp"]');
    this.enterDay = page.locator('//*[@id="dobDay"]');
    this.enterMonth = page.locator('//*[@id="dobMonth"]');
    this.enterYear = page.locator('//*[@id="dobYear"]');
    this.continue = page.locator('//*[@id="main-content"]/div/div/form/button');
    this.warning = page.locator('//*[@id="main-content"]/div[1]/div/div/ul/li/a');

  }


  async shouldFindTitle() {
    await expect(this.pageHeader).toBeVisible();
  }


  async submitFirstTimeIdCode(id: string) {
    await this.enterFirstTimeIdCode.fill(id);
  }
  async submitDay(day: string) {
    await this.enterDay.fill(day);
  }
  async submitMonth(month: string) {
    await this.enterMonth.fill(month);
  }
  async submitYear(year: string) {
    await this.enterYear.fill(year);
    await this.continue.click();
  }
}