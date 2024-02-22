import logger from '../../logger'
import config from '../config'
import PersonOnProbationUserApiClient, { UserDetailsResponse } from '../data/personOnProbationApiClient'
import { RedisClient, createRedisClient, ensureConnected } from '../data/redisClient'
import ResettlementPassportApiClient from '../data/resettlementPassportApiClient'

export default class UserService {
  redisClient: RedisClient

  constructor(
    private readonly resettlementPassportClient: ResettlementPassportApiClient,
    private readonly personOnProbationUserApiClient: PersonOnProbationUserApiClient,
  ) {
    this.redisClient = createRedisClient()
  }

  // This is temporary the endpoint will change
  async checkOtp(email: string, otp: string): Promise<boolean> {
    logger.info(`OTP verification for: ${email} and code: ${otp}`)
    const optData = await this.resettlementPassportClient.getPopUserOtp('G4161UF')
    return optData.otp.toString() === otp
  }

  async isVerified(urn: string): Promise<boolean> {
    logger.info(`User verification: ${urn}`)
    const key = `${urn}-popuser-data`
    if (config.redis.enabled) {
      // read from cache
      await ensureConnected(this.redisClient)
      const cachedUserString = await this.redisClient.get(key)
      if (cachedUserString) {
        logger.info('Pop user data found in cache')
        const cachedUser = JSON.parse(cachedUserString) as UserDetailsResponse
        return Promise.resolve(cachedUser?.verified === true)
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

    return Promise.resolve(fetchedUser?.verified === true)
  }
}
