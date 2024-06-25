import { S3 } from '@aws-sdk/client-s3'
import { readFile } from 'node:fs/promises'
import config from '../config'
import logger from '../../logger'
import { tokenStoreFactory } from '../data/tokenStore/tokenStore'

export interface Feature {
  feature: string
  enabled: boolean
}

export default class FeatureFlagsService {
  private s3 = new S3({ region: config.s3.featureFlag.region, forcePathStyle: true })

  async getFeatureFlag(flag: string): Promise<boolean> {
    const flags = await this.getFeatureFlags()
    logger.info('Fetched flags: ', JSON.stringify(flags))
    const featureEnabled = flags?.find(x => x.feature === flag)?.enabled
    return !!featureEnabled
  }

  private async loadLocalFlags(): Promise<Array<Feature>> {
    const localFlags = await readFile(config.local.featureFlag.filename, { encoding: 'utf-8' })
    return JSON.parse(localFlags)
  }

  private async getFeatureFlags(): Promise<Feature[]> {
    const tokenStore = tokenStoreFactory()
    const flagsCached = await tokenStore.getToken(`feature-flags`)
    if (!flagsCached) {
      try {
        if (!config.s3.featureFlag.enabled) {
          logger.warn('Using local feature flags')
          return this.loadLocalFlags()
        }
        const command = await this.s3.getObject({
          Bucket: config.s3.featureFlag.bucketName,
          Key: `${config.s3.featureFlag.path}/${config.s3.featureFlag.filename}`.toLowerCase(),
        })
        const jsonString = await command.Body.transformToString()
        await tokenStore.setToken(`feature-flags`, jsonString, 120)
        return JSON.parse(jsonString) as Promise<Feature[]>
      } catch (err) {
        logger.error(err, 'Error getting feature flags from S3')
      }
      return null
    }
    return JSON.parse(flagsCached)
  }
}
