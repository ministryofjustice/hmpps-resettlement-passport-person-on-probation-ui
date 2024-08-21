export class GovOneEnterSecurityCode {
  constructor(page) {
    this.page = page;
    this.enterCodeField = page.locator('//*[@id="code"]');
    this.continue = page.locator('//*[@id="form-tracking"]/button');
  }

  async submitCode(String) {
    await this.enterCodeField.type(String);
    await this.continue.click();
  }
}
