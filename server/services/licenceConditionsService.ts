import logger from '../../logger'
import config from '../config'
import ResettlementPassportApiClient from '../data/resettlementPassportApiClient'
import type { LicenceConditionData } from '../data/resettlementPassportData'
import { TokenStore, tokenStoreFactory } from '../data/tokenStore/tokenStore'

const CACHE_MINUTES = 60 * 60

export default class LicenceConditionsService {
  tokenStore: TokenStore

  constructor(private readonly resettlementPassportClient: ResettlementPassportApiClient) {
    this.tokenStore = tokenStoreFactory()
  }

  private getCacheKey = (nomsId: string) => `${nomsId}-licence-conditions-data`

  async getLicenceConditionsByNomsId(nomsId: string, sessionId: string): Promise<LicenceConditionData> {
    logger.info(`Get licence conditions by nomsId`)
    const key = this.getCacheKey(nomsId)

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
    const fetchedLicenceConditions = await this.resettlementPassportClient.getLicenceConditionsByNomsId(
      nomsId,
      sessionId,
    )

    if (fetchedLicenceConditions) {
      // store to cache only briefly
      await this.tokenStore.setToken(key, JSON.stringify(fetchedLicenceConditions), CACHE_MINUTES)
    }
    return Promise.resolve(fetchedLicenceConditions)
  }

  async getLicenceConditionsImage(
    nomsId: string,
    licenceId: number,
    conditionId: number,
    sessionId: string,
  ): Promise<string> {
    logger.info(`Get licence conditions image`)
    const fetchedImage = await this.resettlementPassportClient.getLicenceConditionsImage(
      nomsId,
      licenceId,
      conditionId,
      sessionId,
    )
    return Promise.resolve(fetchedImage)
  }

  async confirmLicenceConditions(nomsId: string, version: number, sessionId: string): Promise<void> {
    logger.info('confirm licence conditions seen')
    // expire cache
    await this.tokenStore.removeToken(this.getCacheKey(nomsId))
    // confirm
    await this.resettlementPassportClient.confirmLicenceConditions(nomsId, version, sessionId)
  }
}
