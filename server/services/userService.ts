import logger from '../../logger'
import config from '../config'
import PersonOnProbationUserApiClient, { UserDetailsResponse } from '../data/personOnProbationApiClient'
import ResettlementPassportApiClient from '../data/resettlementPassportApiClient'
import type { OtpRequest, PersonalDetails } from '../data/resettlementPassportData'
import { TokenStore, tokenStoreFactory } from '../data/tokenStore/tokenStore'

export default class UserService {
  tokenStore: TokenStore

  constructor(
    private readonly resettlementPassportClient: ResettlementPassportApiClient,
    private readonly personOnProbationUserApiClient: PersonOnProbationUserApiClient,
  ) {
    this.tokenStore = tokenStoreFactory()
  }

  async checkOtp(email: string, otp: string, dob: string, urn: string, sessionId: string): Promise<boolean> {
    logger.info(`OTP verification for: ${email} and code: ${otp}`)
    const optData = await this.resettlementPassportClient.submitUserOtp(
      {
        otp,
        urn,
        email,
        dob,
      } as OtpRequest,
      sessionId,
    )
    return optData && optData.id != null
  }

  async getByNomsId(nomsId: string, urn: string, sessionId: string): Promise<PersonalDetails> {
    logger.info(`Get personal details by nomsId`)
    const key = `${urn}-${nomsId}-popuserdetails-data`

    // read from cache
    if (config.redis.enabled) {
      const personalDetailsString = await this.tokenStore.getToken(key)
      if (personalDetailsString) {
        logger.info('Personal details found in cache')
        return JSON.parse(personalDetailsString) as PersonalDetails
      }
    }

    logger.info('Fetching data from Api')
    const fetchedPersonalDetails = await this.resettlementPassportClient.getByNomsId(nomsId, sessionId)
    if (fetchedPersonalDetails && config.redis.enabled) {
      // store to cache
      await this.tokenStore.setToken(
        key,
        JSON.stringify(fetchedPersonalDetails),
        config.apis.resettlementPassportApi.cacheExpirySeconds,
      )
    }
    return fetchedPersonalDetails
  }

  async getUserDetails(urn: string, sessionId: string): Promise<UserDetailsResponse> {
    logger.info(`User verification`)
    const key = `${urn}-popuser-data`

    // read from cache
    if (config.redis.enabled) {
      const cachedUserString = await this.tokenStore.getToken(key)
      if (cachedUserString) {
        logger.info('Pop user data found in cache')
        const cachedUser = JSON.parse(cachedUserString) as UserDetailsResponse
        return Promise.resolve(cachedUser)
      }
    }

    logger.info('Fetching Pop user data from Api')
    const fetchedUser = await this.personOnProbationUserApiClient.getUserByUrn(urn, sessionId)
    if (fetchedUser) {
      // store to cache
      await this.tokenStore.setToken(
        key,
        JSON.stringify(fetchedUser),
        config.apis.resettlementPassportApi.cacheExpirySeconds,
      )
    }

    return Promise.resolve(fetchedUser)
  }

  async isVerified(urn: string, sessionId: string): Promise<boolean> {
    const details = await this.getUserDetails(urn, sessionId)
    return details?.verified ?? false
  }

  async isAuthenticated(urn: string): Promise<boolean> {
    logger.info(`User authentication check: ${urn}`)
    const tokenStore = tokenStoreFactory()
    const tokenValue = await tokenStore.getToken(urn)
    return Promise.resolve(!!tokenValue)
  }
}
