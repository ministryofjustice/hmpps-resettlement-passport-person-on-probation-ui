import { Locator, Page } from "@playwright/test";

export default class govOneSelectOTPMethod {
  readonly page: Page;
  readonly textMessageRadioButton: Locator;
  readonly authAppRadioButton: Locator;
  readonly continue: Locator;

  
  constructor(page: Page) {
    this.page = page;
    this.textMessageRadioButton = page.locator('//*[@id="mfaOptions"]');
    this.authAppRadioButton = page.locator('//*[@id="mfaOptions-2"]');
    this.continue = page.locator('//*[@id="main-content"]/div/div/form/button');
  }

  async submitPhoneOption() {
    await this.textMessageRadioButton.click();
    await this.continue.click();
  }
  async submitAuthAppOption() {
    await this.authAppRadioButton.click();
    await this.continue.click();
  }
}
