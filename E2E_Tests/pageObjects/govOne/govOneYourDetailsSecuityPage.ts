import { expect, Locator, Page } from "@playwright/test";
export default class GovOneSecurityDetails {
  readonly page: Page;
  readonly pageHeader: Locator;
  readonly deleteAccountLink: Locator;
  readonly continue: Locator;
  readonly enterPasswordField: Locator;
  readonly areYouSure: Locator;
  readonly deleteYourAccountButton: Locator;
  readonly deletedAccountBanner: Locator;


  constructor(page: Page) {
    this.page = page;
    
    this.pageHeader = page.locator('h1', { hasText: 'Security' });
    this.areYouSure = page.locator('h1', { hasText: 'Are you sure you want to delete your GOV.UK One Login?' });
    this.deleteAccountLink = page.locator('//*[@id="your-account"]/div/div[3]/p[2]/a');
    this.continue = page.locator('//*[@id="main-content"]/div/div/form/button');
    this.enterPasswordField = page.locator('//*[@id="password"]');
    this.deleteYourAccountButton = page.locator('//*[@id="main-content"]/div/div/form/button');
    this.deletedAccountBanner = page.locator('h1', { hasText: 'You’ve deleted your GOV.UK One Login' });
    
    
  }

  async shouldFindTitle() {
    await expect(this.pageHeader).toBeVisible();
  }
  async confirmAreYouSure() {
    await expect(this.areYouSure).toBeVisible();
    await this.deleteYourAccountButton.click();
    await expect(this.deletedAccountBanner).toBeVisible();
  }

  async gotoDeleteAccount() {
    await this.page.goto('https://home.integration.account.gov.uk/enter-password?type=deleteAccount');
  }

  async submitPassword(password: string) {
    await this.enterPasswordField.fill(password);
    await this.continue.click();
  }
}