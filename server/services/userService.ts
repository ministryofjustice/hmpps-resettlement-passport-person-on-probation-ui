import logger from '../../logger'
import config from '../config'
import PersonOnProbationUserApiClient, { UserDetailsResponse } from '../data/personOnProbationApiClient'
import { RedisClient, createRedisClient, ensureConnected } from '../data/redisClient'
import ResettlementPassportApiClient from '../data/resettlementPassportApiClient'
import type { OtpRequest, PersonalDetails } from '../data/resettlementPassportData'

export default class UserService {
  redisClient: RedisClient

  constructor(
    private readonly resettlementPassportClient: ResettlementPassportApiClient,
    private readonly personOnProbationUserApiClient: PersonOnProbationUserApiClient,
  ) {
    this.redisClient = createRedisClient()
  }

  async checkOtp(email: string, otp: string, urn: string): Promise<boolean> {
    logger.info(`OTP verification for: ${email} and code: ${otp}`)
    const optData = await this.resettlementPassportClient.submitUserOtp({
      otp,
      urn,
      email,
    } as OtpRequest)
    return optData && optData.id != null
  }

  async getByNomsId(nomsId: string, urn: string): Promise<PersonalDetails> {
    logger.info(`Get personal details by nomsId`)
    const key = `${urn}-${nomsId}-popuserdetails-data`
    if (config.redis.enabled) {
      // read from cache
      await ensureConnected(this.redisClient)
      const personalDetailsString = await this.redisClient.get(key)
      if (personalDetailsString) {
        logger.info('Personal details found in cache')
        const personalDetails = JSON.parse(personalDetailsString) as PersonalDetails
        return Promise.resolve(personalDetails)
      }
    }

    logger.info('Fetching data from Api')
    const fetchedPersonalDetails = await this.resettlementPassportClient.getByNomsId(nomsId)
    if (fetchedPersonalDetails && config.redis.enabled) {
      // store to cache
      await this.redisClient.set(key, JSON.stringify(fetchedPersonalDetails), {
        EX: config.session.expiryMinutes * 60,
      })
    }
    return Promise.resolve(fetchedPersonalDetails)
  }

  async isVerified(urn: string): Promise<UserDetailsResponse> {
    logger.info(`User verification`)
    const key = `${urn}-popuser-data`
    if (config.redis.enabled) {
      // read from cache
      await ensureConnected(this.redisClient)
      const cachedUserString = await this.redisClient.get(key)
      if (cachedUserString) {
        logger.info('Pop user data found in cache')
        const cachedUser = JSON.parse(cachedUserString) as UserDetailsResponse
        return Promise.resolve(cachedUser)
      }
    }

    logger.info('Fetching Pop user data from Api')
    const fetchedUser = await this.personOnProbationUserApiClient.getUserByUrn(urn)
    if (fetchedUser && config.redis.enabled) {
      // store to cache
      await this.redisClient.set(key, JSON.stringify(fetchedUser), {
        EX: config.session.expiryMinutes * 60,
      })
    }

    return Promise.resolve(fetchedUser)
  }
}
