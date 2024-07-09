import LicenceConditionsService from './licenceConditionsService'
import logger from '../../logger'
import ResettlementPassportApiClient from '../data/resettlementPassportApiClient'
import { createRedisClient } from '../data/redisClient'
import config from '../config'
import mockRedisClient from '../testutils/mockRedisClient'

jest.mock('../../logger')
jest.mock('../data/resettlementPassportApiClient')
jest.mock('../data/redisClient')

const redisClient = mockRedisClient()

const mockedLicenceConditions = {
  licenceId: 101,
  status: 'ACTIVE',
  startDate: '20/08/2023',
  expiryDate: '12/07/2023',
  standardLicenceConditions: [
    {
      id: 1001,
      image: false,
      text: 'Be of good behaviour and not behave in a way which undermines the purpose of the licence period.',
      sequence: 0,
    },
  ],
  otherLicenseConditions: [
    {
      id: 1008,
      image: true,
      text: 'Not to enter the area of Leeds City Centre, as defined by the attached map, without the prior approval of your supervising officer.',
      sequence: 7,
    },
  ],
  changeStatus: false,
}

describe('LicenceConditionsService', () => {
  let resettlementPassportApiClient: jest.Mocked<ResettlementPassportApiClient>
  let licenceConditionsService: LicenceConditionsService
  const loggerSpy = jest.spyOn(logger, 'info')

  beforeEach(() => {
    config.redis.enabled = true
    jest.mocked(createRedisClient).mockReturnValue(redisClient)
    resettlementPassportApiClient = new ResettlementPassportApiClient() as jest.Mocked<ResettlementPassportApiClient>
    licenceConditionsService = new LicenceConditionsService(resettlementPassportApiClient)
  })

  afterEach(() => {
    jest.restoreAllMocks()
    config.redis.enabled = false
  })

  it('should fetch the licenceConditions details with a new identifier', async () => {
    const nomsId = 'A8731DY'
    resettlementPassportApiClient.getLicenceConditionsByNomsId.mockResolvedValue(mockedLicenceConditions)
    const result = await licenceConditionsService.getLicenceConditionsByNomsId(nomsId, 'session')
    expect(result).toBe(mockedLicenceConditions)
    expect(loggerSpy).toHaveBeenCalledWith(`Get licence conditions by nomsId`)
    expect(redisClient.get).toHaveBeenCalledWith(`${nomsId}-licence-conditions-data`)
  })

  it('should confirm a licence condition update has been seen and remove the cached data', async () => {
    const nomsId = 'A8731DY'
    resettlementPassportApiClient.confirmLicenceConditions.mockResolvedValue()
    await licenceConditionsService.confirmLicenceConditions(nomsId, 1, 'session')
    expect(loggerSpy).toHaveBeenCalledWith(`confirm licence conditions seen`)
    expect(redisClient.set).toHaveBeenCalledWith(`${nomsId}-licence-conditions-data`, '', { EX: 1 })
  })
})
