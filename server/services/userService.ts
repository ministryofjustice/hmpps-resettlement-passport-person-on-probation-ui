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

  async checkOtp(email: string, otp: string, dob: string, urn: string): Promise<boolean> {
    logger.info(`OTP verification for: ${email} and code: ${otp}`)
    const optData = await this.resettlementPassportClient.submitUserOtp({
      otp,
      urn,
      email,
      dob,
    } as OtpRequest)
    return optData && optData.id != null
  }

  async getByNomsId(nomsId: string, urn: string): Promise<PersonalDetails> {
    logger.info(`Get personal details by nomsId`)
    const key = `${urn}-${nomsId}-popuserdetails-data`

    // read from cache
    if (config.redis.enabled) {
      const personalDetailsString = await this.tokenStore.getToken(key)
      if (personalDetailsString) {
        logger.info('Personal details found in cache')
        const personalDetails = JSON.parse(personalDetailsString) as PersonalDetails
        return Promise.resolve(personalDetails)
      }
    }

    logger.info('Fetching data from Api')
    const fetchedPersonalDetails = await this.resettlementPassportClient.getByNomsId(nomsId)
    if (fetchedPersonalDetails) {
      // store to cache
      await this.tokenStore.setToken(key, JSON.stringify(fetchedPersonalDetails), config.session.expiryMinutes * 60)
    }
    return Promise.resolve(fetchedPersonalDetails)
  }

  async isVerified(urn: string): Promise<UserDetailsResponse> {
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
    const fetchedUser = await this.personOnProbationUserApiClient.getUserByUrn(urn)
    if (fetchedUser) {
      // store to cache
      await this.tokenStore.setToken(key, JSON.stringify(fetchedUser), config.session.expiryMinutes * 60)
    }

    return Promise.resolve(fetchedUser)
  }

  async isAuthenticated(urn: string): Promise<boolean> {
    logger.info(`User authentication check: ${urn}`)
    const tokenStore = tokenStoreFactory()
    const tokenValue = await tokenStore.getToken(urn)
    return Promise.resolve(!!tokenValue)
  }
}
