export class LicenceConditions {
  constructor(page) {
    this.page = page
    this.header = page.locator('[data-qa="licence-conditions-page-title"]')
  }
}
