import superagent from 'superagent'
import logger from '../../logger'
import config from '../config'

interface AccessTokenResponse {
  access_token: string
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
    const token = response.body as AccessTokenResponse
    return token.access_token
  } catch (error) {
    logger.error('Error while fetching hmpps auth token:', error)
    throw error
  }
}

export default getHmppsAuthToken
