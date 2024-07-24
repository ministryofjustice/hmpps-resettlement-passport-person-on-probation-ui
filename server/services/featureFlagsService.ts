import { S3 } from '@aws-sdk/client-s3'
import { readFile } from 'node:fs/promises'
import config from '../config'
import logger from '../../logger'
import { tokenStoreFactory } from '../data/tokenStore/tokenStore'
import { FeatureFlags, Feature } from './featureFlags'

export default class FeatureFlagsService {
  private s3 = new S3({ region: config.s3.featureFlag.region, forcePathStyle: true })

  async getFeatureFlags(): Promise<FeatureFlags> {
    const flags = await this.loadFeatureFlags()
    return new FeatureFlags(flags)
  }

  private async loadLocalFlags(): Promise<Array<Feature>> {
    try {
      const localFlags = await readFile(config.local.featureFlag.filename, { encoding: 'utf-8' })
      return JSON.parse(localFlags)
    } catch (err) {
      logger.error(err, 'Error getting feature flags from filesystem')
      return []
    }
  }

  private async loadFeatureFlags(): Promise<Feature[]> {
    if (!config.s3.featureFlag.enabled) {
      logger.warn('Using local feature flags')
      return this.loadLocalFlags()
    }
    const tokenStore = tokenStoreFactory()
    const flagsCached = await tokenStore.getToken(`feature-flags`)
    if (!flagsCached) {
      try {
        const command = await this.s3.getObject({
          Bucket: config.s3.featureFlag.bucketName,
          Key: `${config.s3.featureFlag.path}/${config.s3.featureFlag.filename}`.toLowerCase(),
        })
        const jsonString = await command.Body.transformToString()
        await tokenStore.setToken(`feature-flags`, jsonString, 120)
        const flags = JSON.parse(jsonString) as Feature[]
        logger.info('Fetched flags: ', JSON.stringify(flags))
        return flags
      } catch (err) {
        logger.error(err, 'Error getting feature flags from S3')
      }
      return []
    }
    return JSON.parse(flagsCached)
  }
}
