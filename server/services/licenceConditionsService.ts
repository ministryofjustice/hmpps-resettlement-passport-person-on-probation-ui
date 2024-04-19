import logger from '../../logger'
import config from '../config'
import ResettlementPassportApiClient from '../data/resettlementPassportApiClient'
import type { LicenceConditionData } from '../data/resettlementPassportData'
import { TokenStore, tokenStoreFactory } from '../data/tokenStore/tokenStore'

const CACHE_MINUTES = 60 * 5

export default class LicenceConditionsService {
  tokenStore: TokenStore

  constructor(private readonly resettlementPassportClient: ResettlementPassportApiClient) {
    this.tokenStore = tokenStoreFactory()
  }

  async getLicenceConditionsByNomsId(nomsId: string): Promise<LicenceConditionData> {
    logger.info(`Get licence conditions by nomsId`)
    const key = `${nomsId}-licence-conditions-data`

    // read from cache
    if (config.redis.enabled) {
      const licenceConditionsString = await this.tokenStore.getToken(key)
      if (licenceConditionsString) {
        logger.info('LicenceConditions found in cache')
        const licenceConditions = JSON.parse(licenceConditionsString) as LicenceConditionData
        return Promise.resolve(licenceConditions)
      }
    }

    logger.info('Fetching licence conditions from Api')
    const fetchedLicenceConditions = await this.resettlementPassportClient.getLicenceConditionsByNomsId(nomsId)

    if (fetchedLicenceConditions) {
      // store to cache only briefly
      await this.tokenStore.setToken(key, JSON.stringify(fetchedLicenceConditions), CACHE_MINUTES)
    }
    return Promise.resolve(fetchedLicenceConditions)
  }

  async getLicenceConditionsImage(nomsId: string, licenceId: number, conditionId: number): Promise<string> {
    logger.info(`Get licence conditions image`)
    const fetchedImage = await this.resettlementPassportClient.getLicenceConditionsImage(nomsId, licenceId, conditionId)
    return Promise.resolve(fetchedImage)
  }
}
