import logger from '../../logger'
import config from '../config'
import { RedisClient, createRedisClient, ensureConnected } from '../data/redisClient'
import ResettlementPassportApiClient from '../data/resettlementPassportApiClient'
import type { LicenceConditionData } from '../data/resettlementPassportData'

const CACHE_MINUTES = 60 * 5

export default class LicenceConditionsService {
  redisClient: RedisClient

  constructor(private readonly resettlementPassportClient: ResettlementPassportApiClient) {
    this.redisClient = createRedisClient()
  }

  async getLicenceConditionsByNomsId(nomsId: string): Promise<LicenceConditionData> {
    logger.info(`Get licence conditions by nomsId`)
    const key = `${nomsId}-licence-conditions-data`
    if (config.redis.enabled) {
      // read from cache
      await ensureConnected(this.redisClient)
      const licenceConditionsString = await this.redisClient.get(key)
      if (licenceConditionsString) {
        logger.info('LicenceConditions found in cache')
        const licenceConditions = JSON.parse(licenceConditionsString) as LicenceConditionData
        return Promise.resolve(licenceConditions)
      }
    }

    logger.info('Fetching licence conditions from Api')
    const fetchedLicenceConditions = await this.resettlementPassportClient.getLicenceConditionsByNomsId(nomsId)

    if (fetchedLicenceConditions && config.redis.enabled) {
      // store to cache only briefly
      await this.redisClient.set(key, JSON.stringify(fetchedLicenceConditions), {
        EX: CACHE_MINUTES,
      })
    }
    return Promise.resolve(fetchedLicenceConditions)
  }
}
