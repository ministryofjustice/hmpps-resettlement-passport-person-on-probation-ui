import { Locator, Page } from "@playwright/test";

export default class GovOneCheckEmail {

  readonly page: Page;
  readonly enterCodeField: Locator;
  readonly continue: Locator;

  constructor(page: Page) {
    this.page = page;
    this.enterCodeField = page.locator('//*[@id="code"]');
    this.continue = page.locator('//*[@id="main-content"]/div/div/form/button');
  }

  async submitCode(code: string) {
    await this.enterCodeField.fill(code);
    await this.continue.click();
  }
}
