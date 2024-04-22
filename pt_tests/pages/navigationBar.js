export class NavigationBar {
    constructor(page) {
        this.page = page;   
        this.home = page.locator('[data-qa="home-nav-link"]');
        this.appointments = page.locator('[data-qa="appointments-nav-link"]'); 
        this.licenceConditions = page.locator('[data-qa="licence-conditions-nav-link"]');
        this.profile = page.locator('[data-qa="profile-nav-link"]');
        this.settings = page.locator('[data-qa="settings-nav-link"]');
        this.signOut = page.locator('[data-qa="signOut-nav-link"]');      
      }
    }