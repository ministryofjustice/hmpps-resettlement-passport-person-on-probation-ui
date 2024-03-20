import OtpPage from '../../pages/otp'
import Page from '../../pages/page'
import superagent from 'superagent'

export interface AccessTokenResponse {
  access_token: string
  expires_in: number
}

const getHmppsAuthToken = async () => {
  const apiClientId = Cypress.env('USER_API_CLIENT_ID')
  const apiClientSecret = Cypress.env('USER_API_CLIENT_SECRET')
  const url = Cypress.env('HMPPS_AUTH_URL')
  const basicAuth = Buffer.from(`${apiClientId}:${apiClientSecret}`).toString('base64')
  try {
    const response = await superagent
      .post(`${url}/oauth/token?grant_type=client_credentials`)
      .set('Content-Type', 'application/json')
      .set('Authorization', `Basic ${basicAuth}`)

    cy.log('----- Received hmpps auth token')
    return response.body as AccessTokenResponse
  } catch (error) {
    cy.log('----- Error while fetching hmpps auth token:', error)
    throw error
  }
}

context('OTP registration E2E', () => {
  let otp

  const createOtp = () => {
    otp = ''
    const url = Cypress.env('PSFR_API_URL') + '/resettlement-passport/popUser/G4161UF/otp'
    return cy.request('POST', url, otp)
      .then((response) => {
        otp = response.body.otp
        console.log(`New OTP from API: ${otp}`)
      })
  }

  const enterValidOtp = (otp: string) => {
    cy.get('#otp').type(otp)
    cy.get('#dobDay').type('30')
    cy.get('#dobMonth').type('05')
    cy.get('#dobYear').type('1974')
    cy.get('.govuk-button').click()
  }

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
  })

  afterEach(() => {
    cy.get('[data-qa="signOut"]').click()
    cy.contains('You have been logged out.')
  })

  it('Should continue to Dashboard after validating OTP (valid)', () => {
    cy.signIn()
    cy.visit('/otp')
    Page.verifyOnPage(OtpPage)

    // call api to get an
    createOtp()
      .then(() => {
        console.log(`OTP is now: ${otp}`)
      })

    enterValidOtp(otp)
    cy.contains('John Smith')
  })

})
