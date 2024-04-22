export class GovOneEnterPassword {
  constructor(page) {
    this.page = page
    this.enterPasswordField = page.locator('//*[@id="password"]')
    this.continue = page.locator('//*[@id="form-tracking"]/button')
  }

  async submitPassword(String) {
    await this.enterPasswordField.type(String)
    await this.continue.click()
  }
}
