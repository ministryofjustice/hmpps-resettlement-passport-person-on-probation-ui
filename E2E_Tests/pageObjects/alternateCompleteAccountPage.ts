import { expect, type Locator, type Page } from '@playwright/test'

export default class AlternateCompleteAccountPage {
  private page: Page

  readonly pageHeader: Locator
  readonly enterFirstTimeIdCode: Locator;
  readonly enterDay: Locator;
  readonly enterMonth: Locator;
  readonly enterYear: Locator;
  readonly continue: Locator;
  readonly selectAlternateLogin: Locator;
  readonly enterFirstName: Locator;
  readonly enterLastName: Locator;
  readonly enterPrisonerNumber: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageHeader = page.locator('h1', { hasText: 'Complete your account setup securely'});
    this.enterFirstName = page.locator('#first-name');
    this.enterLastName = page.locator('#last-name');
    this.enterDay = page.locator('#dob-day');
    this.enterMonth = page.locator('#dob-month');
    this.enterYear = page.locator('#dob-year');
    this.continue = page.locator('#submit');
    this.enterPrisonerNumber = page.locator('#prisoner-number');
  }


  async shouldFindTitle() {
    await expect(this.pageHeader).toBeVisible();
  }
  async submitFirstName(firstName: string) {
    await this.enterFirstName.fill(firstName);
  }
  async submitLastName(lastName: string) {
    await this.enterLastName.fill(lastName);
  }
  async submitPrisonerNumber(prisonerNumber: string) {
    await this.enterPrisonerNumber.fill(prisonerNumber);
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