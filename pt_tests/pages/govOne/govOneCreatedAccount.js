export class GovOneCreatedAccount {
    constructor(page) {
        this.page = page;
        this.continue = page.locator('//*[@id="form-tracking"]/button');
      }
    }