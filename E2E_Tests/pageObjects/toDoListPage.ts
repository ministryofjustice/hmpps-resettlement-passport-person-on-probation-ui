import { expect, type Locator, type Page } from '@playwright/test'
import { todoItemTitle } from '../test/steps/commonSteps'

export default class ToDoListPage {
  private page: Page

  readonly pageHeader: Locator
  readonly addNewItemButton: Locator
  readonly completedTasksDropdown: Locator
  readonly completedTaskTitle: Locator
  readonly doneTickbox: Locator
  readonly taskTitle: Locator

  constructor(page: Page) {
    this.page = page;
    this.pageHeader = page.locator('h1', { hasText: 'To-do list'});
    this.addNewItemButton = page.locator('#add-new-button');
    this.completedTasksDropdown = page.locator('#summary.govuk-details__summary');
    this.completedTaskTitle = page.locator('#completed-table > tbody > tr:nth-child(1) > td.govuk-table__cell.todo-table-completed-title')
    this.doneTickbox = page.locator('[name="task-status"]');
    this.taskTitle = page.locator('#td.govuk-table__cell');
  }

  async shouldFindTitle() {
    await expect(this.pageHeader).toBeVisible();
  }
  async clickAddNewItemButton() {
    await this.addNewItemButton.click();
  }
  async toggleCompletedTasksDropdown() {
    await this.completedTasksDropdown.click();
  }
  async clickDoneTickbox() {
    await this.doneTickbox.click();
  }
  async taskTitleShouldDisplay() {
    await expect(this.taskTitle).toHaveText(todoItemTitle);
  }
  async completedTaskShouldDisplay() {
    await expect(this.completedTaskTitle).toHaveText(todoItemTitle);
  }
}