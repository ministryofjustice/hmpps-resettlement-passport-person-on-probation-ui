// @ts-nocheck
const superagent = require('superagent');

const getHmppsAuthToken = async (apiClientId: string, apiClientSecret: string) => {
    const basicAuth = Buffer.from(`${apiClientId}:${apiClientSecret}`).toString('base64')
    try {
      const url = 'https://sign-in-dev.hmpps.service.justice.gov.uk/auth/oauth/token'
      const response = await superagent
        .post(`${url}/oauth/token?grant_type=client_credentials`)
        .set('Content-Type', 'application/json')
        .set('Authorization', `Basic ${basicAuth}`)
      return response.body
    } catch (error) {
      console.error('Error while fetching hmpps auth token:', error)
      throw error
    }
}

const getOtpForNomisId = async (nomisId: string, token: string) => {
    try {
      const url = `https://resettlement-passport-api-dev.hmpps.service.justice.gov.uk/resettlement-passport/popUser/${nomisId}/otp`
      const response = await superagent
        .get(url)
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
      return response.body
    } catch (error) {
      console.error('Error while fetching otp from PSFR API:', error)
      throw error
    }
}

export const getFirstTimeIdCode = async (nomisId: string) => {
    const apiClientId = process.env.CLIENT_ID
    const apiClientSecret = process.env.CLIENT_SECRET
    const authToken = await getHmppsAuthToken(apiClientId, apiClientSecret)
    console.log("authToken is:", authToken.access_token)
    const otpResponse = await getOtpForNomisId(nomisId, authToken.access_token)
    return otpResponse.otp
}