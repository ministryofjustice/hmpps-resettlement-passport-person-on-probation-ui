export class Appointments {
  constructor(page) {
    this.page = page;

    this.olderAppointments = page.locator('[data-qa="profile-nav-link"]');

    this.header = page.locator('[data-qa="appointments-page-title"]');
  }
}
