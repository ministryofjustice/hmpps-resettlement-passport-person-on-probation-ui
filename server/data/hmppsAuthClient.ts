import superagent from 'superagent'
import logger from '../../logger'
import config from '../config'

export interface AccessTokenResponse {
  access_token: string
  expires_in: number
}

const getHmppsAuthToken = async () => {
  const { apiClientId, apiClientSecret, url } = config.apis.hmppsAuth
  const basicAuth = Buffer.from(`${apiClientId}:${apiClientSecret}`).toString('base64')
  try {
    logger.info('Fetching HMPPS Auth token')
    const response = await superagent
      .post(`${url}/oauth/token?grant_type=client_credentials`)
      .set('Content-Type', 'application/json')
      .set('Authorization', `Basic ${basicAuth}`)
    return response.body as AccessTokenResponse
  } catch (error) {
    logger.error('Error while fetching hmpps auth token:', error)
    throw error
  }
}

export default getHmppsAuthToken
