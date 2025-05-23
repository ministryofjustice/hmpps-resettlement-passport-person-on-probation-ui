import { expect, Locator, Page } from "@playwright/test";

export default class GovOneLogin {
  readonly page: Page;
  readonly acceptCookies: Locator;
  readonly signInButton: Locator;
  readonly createLogin: Locator;
  readonly gov1Header: Locator;
  readonly gettingErrorHeader: Locator;


  constructor(page: Page) {
    this.page = page;

    this.acceptCookies = page.locator('//*[@id="cookies-banner-main"]/div[2]/button[1]');
    this.signInButton = page.locator('//*[@id="sign-in-button"]');
    this.createLogin = page.locator('//*[@id="create-account-link"]');
    this.gov1Header = page.locator('//*[@id="main-content"]/div/div/h1');
    this.gettingErrorHeader = page.locator('h1', { hasText: 'Sorry, you cannot access GOV.UK One Login from this page' });
  }

  async gotoPlan() {
    await this.page.goto('https://person-on-probation-user-ui-dev.hmpps.service.justice.gov.uk/');
  }

  async gotoIntegrationLogin() {
    await this.page.goto('https://signin.integration.account.gov.uk/');
    await this.page.waitForLoadState();
  }
  async shouldFindTitle() {
    await expect(this.gettingErrorHeader).toBeVisible();
  }

}
