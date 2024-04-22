export class GovOneCheckEmail {
  constructor(page) {
    this.page = page
    this.enterCodeField = page.locator('//*[@id="code"]')
    this.continue = page.locator('//*[@id="main-content"]/div/div/form/button')
  }

  async submitCode(String) {
    await this.enterCodeField.type(String)
    await this.continue.click()
  }
}
