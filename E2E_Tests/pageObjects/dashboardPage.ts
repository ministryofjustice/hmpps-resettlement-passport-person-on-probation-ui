import { expect, type Locator, type Page } from '@playwright/test'

export default class DashboardPage {
    private page: Page;

    readonly pageHeader: Locator;
    readonly toDoListTopLink: Locator;
    readonly overviewTopLink: Locator;
    readonly numberOfToDoItems: Locator;
  
    constructor(page: Page) {
      this.page = page;
      this.pageHeader = page.locator('[data-qa="pyf-overview-title"]', { hasText: 'Plan your future'});
      this.overviewTopLink = page.locator('[data-qa="home-nav-link"]', { hasText: 'Overview'});
      this.toDoListTopLink = page.locator('[data-qa="todo-nav-link"]', { hasText: 'To-do list'});
      this.numberOfToDoItems = page.locator('#todo-tile > div > p:nth-child(3) > strong');
    }
  
    async shouldFindTitle() {
      await expect(this.pageHeader).toBeVisible();
    }
    async clickToDolistTopLink() {
      this.toDoListTopLink.click();
    }
    async clickOverviewTopLink() {
      this.overviewTopLink.click();
    }
    async shouldDisplayCorrectNumberOfToDoItems() {
      await expect(this.numberOfToDoItems).toContainText('0');
    }
    async shouldDisplayOneMoreToDoItem() {
      await expect(this.numberOfToDoItems).toContainText('1');
    }
}