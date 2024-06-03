export class PYFLandingPage {
  constructor(page) {
    this.page = page
    this.header = page.locator('//*[@id="main-content"]/div/div/h1')
    this.startNowButton = page.locator('//*[@id="main-content"]/div/div/p[2]/a')
  }
}
