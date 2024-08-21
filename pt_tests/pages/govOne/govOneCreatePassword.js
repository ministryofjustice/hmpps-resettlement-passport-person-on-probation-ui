export class GovOneCreatePassword {
  constructor(page) {
    this.page = page;
    this.enterPassword1Field = page.locator('//*[@id="password"]');
    this.enterPassword2Field = page.locator('//*[@id="confirm-password"]');
    this.continue = page.locator('//*[@id="main-content"]/div/div/form/button');
  }

  async submitNewPassword(String) {
    await this.enterPassword1Field.type(String);
    await this.enterPassword2Field.type(String);
    await this.continue.click();
  }
}
