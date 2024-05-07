import { Locator, Page } from "@playwright/test";

export default class GovOneEnterPassword {
  readonly page: Page;
  readonly enterPasswordField: Locator;
  readonly continue: Locator;
  
  
  constructor(page: Page) {
    this.page = page;
    this.enterPasswordField = page.locator('//*[@id="password"]');
    this.continue = page.locator('//*[@id="form-tracking"]/button');
  }

  async submitPassword(password: string) {
    await this.enterPasswordField.fill(password);
    await this.continue.click();
  }
}
