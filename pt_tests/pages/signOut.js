export class SignOut {
  constructor(page) {
    this.page = page;
    this.header = page.locator('//*[@id="main-content"]/div/div/h1');
  }
}
