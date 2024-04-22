import encoding from 'k6/encoding';

export class GovOneLogin {
  
    constructor(page) {
      
        this.page = page

        this.acceptCookies = page.locator('//*[@id="cookies-banner-main"]/div[2]/button[1]');
        this.signInButton = page.locator('//*[@id="sign-in-button"]');
        this.createLogin = page.locator('//*[@id="create-account-link"]');
        this.gov1Header = page.locator('//*[@id="main-content"]/div/div/h1');
      }
  
      async gotoPlan() {
        await this.page.goto('https://person-on-probation-user-ui-dev.hmpps.service.justice.gov.uk/');
      }
      async gotoIntegrationLogin() {
        await this.page.goto('https://integration-user:winter2021@signin.integration.account.gov.uk/');
      }
    
      async submitLogin() {

        await this.passwordField.type('rp123#');
        await this.continue0.click();
        
      }

    }

