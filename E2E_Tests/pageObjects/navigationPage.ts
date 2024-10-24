import { expect, type Locator, type Page } from '@playwright/test'

export default class NavigationPage {
  private page: Page;

  readonly pageHeader: Locator;
  readonly overviewLink: Locator;
  readonly appointmentsLink: Locator;
  readonly licenceConditionsLink: Locator;
  readonly profileLink: Locator;
  readonly settingsLink: Locator;
  readonly signOutLink: Locator;
  readonly documentsLink: Locator;
  

  constructor(page: Page) {
    this.page = page;
    this.pageHeader = page.locator('h1');
    this.overviewLink = page.locator('[data-qa="home-nav-link"]');
    this.appointmentsLink = page.locator('[data-qa="appointments-nav-link"]');
    this.licenceConditionsLink = page.locator('[data-qa="licence-conditions-nav-link"]');
    this.profileLink = page.locator('[data-qa="profile-nav-link"]');
    this.settingsLink = page.locator('[data-qa="settings-nav-link"]');
    this.documentsLink = page.locator('[data-qa="documents-nav-link"]');
    this.signOutLink = page.locator('[data-qa="signOut"]');
  }

  async shouldFindTitle() {
    await expect(this.pageHeader).toBeVisible();
  }

}
