import { expect, type Locator, type Page } from '@playwright/test'

export default class AddToDoListItemPage {
  private page: Page

  readonly pageHeader: Locator
  readonly enterTitle: Locator;
  readonly enterNotes: Locator;
  readonly enterDay: Locator;
  readonly enterMonth: Locator;
  readonly enterYear: Locator;
  readonly addTaskButton: Locator;
  readonly warningHeader: Locator;
  readonly warningTitle: Locator;
  readonly warningTitleError: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageHeader = page.locator('h1', { hasText: 'Add a to-do list item' });
    this.enterTitle = page.locator('#title');
    this.enterNotes = page.locator('#notes');
    this.enterDay = page.locator('#due-date-day');
    this.enterMonth = page.locator('#due-date-month');
    this.enterYear = page.locator('#due-date-year');
    this.addTaskButton = page.locator('#submit-button');
    this.warningHeader = page.locator('#main-content > div > div > div > div > h2');
    this.warningTitle = page.locator('#main-content > div > div > div > div > div');
    this.warningTitleError = page.locator('#title-error');
  }

  async shouldFindTitle() {
    await expect(this.pageHeader).toBeVisible();
  }
  async submitTitle(title: string) {
    await this.enterTitle.fill(title);
  }
  async submitNotes(notes: string) {
    await this.enterNotes.fill(notes);
  }
  async submitDay(day: string) {
    await this.enterDay.fill(day);
  }
  async submitMonth(month: string) {
    await this.enterMonth.fill(month);
  }
  async submitYear(year: string) {
    await this.enterYear.fill(year);
  }
  async clickAddTaskButton() {
    await this.addTaskButton.click();
  }
  async warningHeaderShouldDisplay() {
    await expect(this.warningHeader).toBeVisible();
  }
  async warningTitleShouldDisplay() {
    await expect(this.warningTitle).toBeVisible();
  }
  async warningTitleErrorShouldDisplay() {
    await expect(this.warningTitleError).toBeVisible();
  }
}