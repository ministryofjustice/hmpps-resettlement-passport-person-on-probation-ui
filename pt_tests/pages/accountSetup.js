export class AccountSetup {
    constructor(page) {
        this.page = page;
        this.enterLoginCodeField = page.locator('//*[@id="otp"]');
        this.enterDayField = page.locator('//*[@id="dobDay"]');
        this.enterMonthField = page.locator('//*[@id="dobMonth"]');
        this.enterYearField = page.locator('//*[@id="dobYear"]');
        this.continue = page.locator('//*[@id="main-content"]/div/div/form/button');
      }

      async submitLoginCode(String) {

        await this.enterLoginCodeField.type(String);
        await this.continue.click();       
      }

      async submitDay(String) {

        await this.enterDayField.type(String);
        await this.continue.click();       
      }

      async submitMonth(String) {

        await this.enterMonthField.type(String);
        await this.continue.click();   
      }

      async submitYear(String) {

        await this.enterYearField.type(String);
        await this.continue.click();
      }

    }