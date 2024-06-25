import { GetObjectCommand, S3 } from '@aws-sdk/client-s3'
import { mockClient } from 'aws-sdk-client-mock'
import { readFile } from 'node:fs/promises'
import config from '../config'
import logger from '../../logger'
import { createRedisClient } from '../data/redisClient'
import FeatureFlagsService from './featureFlagsService'
import mockRedisClient from '../testutils/mockRedisClient'

jest.mock('node:fs/promises')
jest.mock('../config')
jest.mock('../../logger')
jest.mock('../data/redisClient')

const s3Mock = mockClient(S3)
const readFileMock = readFile as jest.MockedFunction<typeof readFile>

const loggerMock = logger as jest.Mocked<typeof logger>

describe('FeatureFlagsService', () => {
  const redisClient = mockRedisClient()
  let service: FeatureFlagsService

  beforeEach(() => {
    config.redis.enabled = true
    jest.mocked(createRedisClient).mockReturnValue(redisClient)
    service = new FeatureFlagsService()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('getFeatureFlag', () => {
    it('should return cached flags if available', async () => {
      redisClient.get.mockResolvedValue(JSON.stringify([{ feature: 'cached-feature', enabled: true }]))
      const result = await service.getFeatureFlag('cached-feature')
      expect(result).toBe(true)
    })

    it('should load local flags if S3 feature flag is disabled', async () => {
      redisClient.get.mockResolvedValue(null)
      config.s3.featureFlag.enabled = false
      const localFlags = '[{"feature":"local-feature","enabled":true}]'
      readFileMock.mockResolvedValue(localFlags)

      const result = await service.getFeatureFlag('local-feature')
      expect(result).toBe(true)
    })

    it('should fetch flags from S3 if not cached', async () => {
      redisClient.get.mockResolvedValue(null)
      config.s3.featureFlag.enabled = true

      s3Mock.on(GetObjectCommand).resolves({
        // @ts-expect-error TS2322
        Body: {
          transformToString: jest.fn().mockResolvedValue(JSON.stringify([{ feature: 's3-feature', enabled: true }])),
        },
      })

      const result = await service.getFeatureFlag('s3-feature')
      expect(result).toBe(true)
      expect(redisClient.set).toHaveBeenCalled()
    })

    it('should log an error if fetching flags from S3 fails', async () => {
      redisClient.get.mockResolvedValue(null)
      config.s3.featureFlag.enabled = true

      s3Mock.on(GetObjectCommand).rejects(new Error('S3 Error'))
      const result = await service.getFeatureFlag('s3-error')
      expect(loggerMock.error).toHaveBeenCalledWith(expect.any(Error), 'Error getting feature flags from S3')

      expect(result).toBe(false)
    })
  })
})
