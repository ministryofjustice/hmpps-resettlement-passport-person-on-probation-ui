export class Settings {
  constructor(page) {
    this.page = page
    this.header = page.locator('[data-qa="settings-page-title"]')
  }
}
