export class Dashboard {
  constructor(page) {
    this.page = page
    // todo
    this.appointmentsBanner = page.locator('//*[@id="dashboard-appointments"]/div/div[2]/p/a')

    this.appointmentsTile = page.locator('[data-qa="appointments-tile-title"]')
    this.licenceConditionsTile = page.locator('[data-qa="licence-conditions-tile-title"]')
    this.profileTile = page.locator('[data-qa="profile-tile-title"]')

    this.header = page.locator('[data-qa="pyf-overview-h1"]')
  }
}
