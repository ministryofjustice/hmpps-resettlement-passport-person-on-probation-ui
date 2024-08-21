export class Profile {
  constructor(page) {
    this.page = page;
    this.header = page.locator('[data-qa="profile-page-title"]');
  }
}
