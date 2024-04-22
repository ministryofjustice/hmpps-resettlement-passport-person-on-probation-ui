export class GovOneEnterSecurityCode {
  constructor(page) {
    this.page = page
    this.enterCodeField = page.locator('//*[@id="code"]')
    this.continue = page.locator('//*[@id="form-tracking"]/button')
  }

  async submitEmail(String) {
    await this.enterCodeField.type(String)
    await this.continue.click()
  }
}
