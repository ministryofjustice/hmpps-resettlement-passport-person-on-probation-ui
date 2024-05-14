import { Locator, Page } from "@playwright/test";
export default class GovOneChangedOTP {
  readonly page: Page;
  readonly continue: Locator;



  constructor(page: Page) {
    this.page = page;
    this.continue = page.locator('//*[@id="main-content"]/div/div/form/button');
  }

}