import { setUserActivity, hasUserActivity } from './userActivityTracking'
import logger from '../../logger'
import { createRedisClient } from '../data/redisClient'
import config from '../config'
import mockRedisClient from '../testutils/mockRedisClient'

jest.mock('../../logger')
jest.mock('../data/redisClient')

const redisClient = mockRedisClient()

const oneLoginTestUrn = 'fdc:gov.uk:2022:asdasdasd-asdasdasd'

describe('userActivityTracking', () => {
  const loggerSpy = jest.spyOn(logger, 'info')

  beforeEach(() => {
    config.redis.enabled = true
    jest.mocked(createRedisClient).mockReturnValue(redisClient)
  })

  afterEach(() => {
    jest.restoreAllMocks()
    config.redis.enabled = false
  })

  test('should hasUserActivity', async () => {
    const result = await hasUserActivity(oneLoginTestUrn)
    expect(result).toBeFalsy()
    expect(loggerSpy).toHaveBeenCalledWith(`User activity session check: ${oneLoginTestUrn}`)
    expect(redisClient.get).toHaveBeenCalledWith(`${oneLoginTestUrn}-activity-session`)
  })

  test('should setUserActivity', async () => {
    await setUserActivity(oneLoginTestUrn)
    expect(loggerSpy).toHaveBeenCalledWith(`User activity session set: ${oneLoginTestUrn}`)
    expect(redisClient.set).toHaveBeenCalledWith(`${oneLoginTestUrn}-activity-session`, expect.any(String), {
      EX: config.session.inactivityMinutes * 60,
    })
  })
})
