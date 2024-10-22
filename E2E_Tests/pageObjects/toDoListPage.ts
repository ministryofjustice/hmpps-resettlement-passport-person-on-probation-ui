import { expect, type Locator, type Page } from '@playwright/test'
import { todoItemTitle } from '../test/steps/commonSteps'

export default class ToDoListPage {
    private page: Page

    readonly pageHeader: Locator
    readonly addNewItemButton: Locator
    readonly completedTasksDropdown: Locator
    readonly doneTickbox: Locator
    readonly taskTitle: Locator

    constructor(page: Page) {
        this.page = page;
        this.pageHeader = page.locator('h1', { hasText: 'To-do list' });
        this.addNewItemButton = page.locator('#add-new-button');
        this.completedTasksDropdown = page.locator('#summary.govuk-details__summary');
        this.doneTickbox = page.getByRole('checkbox', { name: 'complete task test automation' });
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
        await this.doneTickbox.click({ force: true });
    }
    async taskTitleShouldDisplay() {
        await expect(this.taskTitle).toHaveText(todoItemTitle);
    }
}