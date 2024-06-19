import { Locator, Page } from "@playwright/test";
export default class GovOneEnterEmail {
  readonly page: Page;
  readonly enterEmailField: Locator;
  readonly continue: Locator;



  constructor(page: Page) {
    this.page = page;
    this.enterEmailField = page.locator('//*[@id="email"]');
    this.continue = page.locator('//*[@id="main-content"]/div/div/form/button');
  }

  async submitEmail(email: string) {
    await this.enterEmailField.fill(email);
    await sleep(2000);
    await this.continue.click();
  }

  
}

function sleep(ms: number | undefined) {
  console.log('waiting')
  return new Promise(resolve => setTimeout(resolve, ms))
}
