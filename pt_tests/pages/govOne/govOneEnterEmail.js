export class GovOneEnterEmail {
    constructor(page) {
        this.page = page;
        this.enterEmailField = page.locator('//*[@id="email"]');
        this.continue = page.locator('//*[@id="main-content"]/div/div/form/button');
      }

      async submitEmail(String) {

        await this.enterEmailField.type(String);
        await this.continue.click();
        
      }
    }