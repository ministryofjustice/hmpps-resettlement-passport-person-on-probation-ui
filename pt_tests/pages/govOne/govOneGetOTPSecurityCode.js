export class GovOneGetSecurityCode {
  constructor(page) {
    this.page = page
    this.textMessageRadioButton = page.locator('//*[@id="mfaOptions"]')
    this.textAuthAppRadioButton = page.locator('//*[@id="mfaOptions-2"]')
    this.continue = page.locator('//*[@id="main-content"]/div/div/form/button')
  }

  async submitOption() {
    await this.textAuthAppRadioButton.click()
    await this.continue.click()
  }
}
