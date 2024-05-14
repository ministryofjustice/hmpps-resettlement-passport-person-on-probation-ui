import { Locator, Page } from "@playwright/test";

export default class GovOneCreatePassword {
  readonly page: Page;
  readonly enterPassword1Field: Locator;
  readonly enterPassword2Field: Locator;
  readonly continue: Locator;

  constructor(page: Page) {
    this.page = page;
    this.enterPassword1Field = page.locator('//*[@id="password"]');
    this.enterPassword2Field = page.locator('//*[@id="confirm-password"]');
    this.continue = page.locator('//*[@id="main-content"]/div/div/form/button');
  }

  async submitNewPassword(password: string) {
    await this.enterPassword1Field.fill(password);
    await this.enterPassword2Field.fill(password);
    await this.continue.click();
  }
}
