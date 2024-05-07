import { Locator, Page } from "@playwright/test";

export default class GovOneEnterSecurityCode {

  readonly page: Page;
  readonly enterCodeField: Locator;
  readonly continue: Locator;
  readonly iCannotSelectQRDropdown: Locator;
  readonly secretKey: Locator;


  constructor(page: Page) {
    this.page = page;
    this.enterCodeField = page.locator('//*[@id="code"]');
    this.continue = page.locator('//*[@id="form-tracking"]/button');
    this.iCannotSelectQRDropdown = page.locator('//*[@id="main-content"]/div/div/details[2]/summary');
    this.secretKey = page.locator('//*[@id="secret-key"]')
  }

  async submitCode(code: string) {
    await this.enterCodeField.fill(code);
    await this.continue.click();
  }
}
