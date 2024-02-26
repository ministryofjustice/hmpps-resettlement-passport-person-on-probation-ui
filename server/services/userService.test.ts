import UserService from './userService'
import logger from '../../logger'
import ResettlementPassportApiClient from '../data/resettlementPassportApiClient'
import PersonOnProbationUserApiClient from '../data/personOnProbationApiClient'
import { createRedisClient, RedisClient } from '../data/redisClient'
import config from '../config'

jest.mock('../../logger')
jest.mock('../data/resettlementPassportApiClient')
jest.mock('../data/personOnProbationApiClient')
jest.mock('../data/redisClient')

const redisClient = {
  get: jest.fn(),
  set: jest.fn(),
  on: jest.fn(),
  connect: jest.fn(),
  isOpen: true,
} as unknown as jest.Mocked<RedisClient>

const mockedOtpResponse = {
  id: 9,
  crn: 'U416100',
  cprId: 'NA',
  email: 'test@example.com',
  verified: true,
  creationDate: '2024-02-26T11:58:17.812884699',
  modifiedDate: '2024-02-26T11:58:17.812884699',
  nomsId: 'G4161UF',
  oneLoginUrn: 'urn:fdc:gov.asdasdasd',
}

const oneLoginTestUrn = 'fdc:gov.uk:2022:asdasdasd-asdasdasd'

const mockedUserResponse = {
  id: 1,
  crn: 'U123331',
  cprId: 'NA',
  email: 'test@example.com',
  verified: true,
  nomsId: 'A1111UD',
  oneLoginUrn: oneLoginTestUrn,
}

const mockedUserDetailsResponse = {
  personalDetails: {
    prisonerNumber: '123123',
    prisonId: '33',
    firstName: 'John',
    middleNames: 'Paul',
    lastName: 'Smith',
    age: 44,
  },
}

describe('UserService', () => {
  let resettlementPassportApiClient: jest.Mocked<ResettlementPassportApiClient>
  let personOnProbationUserApiClient: jest.Mocked<PersonOnProbationUserApiClient>
  let userService: UserService
  const loggerSpy = jest.spyOn(logger, 'info')

  beforeEach(() => {
    config.redis.enabled = true
    jest.mocked(createRedisClient).mockReturnValue(redisClient)
    resettlementPassportApiClient = new ResettlementPassportApiClient() as jest.Mocked<ResettlementPassportApiClient>
    personOnProbationUserApiClient = new PersonOnProbationUserApiClient() as jest.Mocked<PersonOnProbationUserApiClient>
    userService = new UserService(resettlementPassportApiClient, personOnProbationUserApiClient)
  })

  afterEach(() => {
    jest.restoreAllMocks()
    config.redis.enabled = false
  })

  test('should validate an OTP code', async () => {
    const email = 'test@example.com'
    const code = '123456'
    resettlementPassportApiClient.submitUserOtp.mockResolvedValue(mockedOtpResponse)
    const result = await userService.checkOtp(email, code, 'urn:aaa:bbb')
    expect(result).toBe(true)
    expect(loggerSpy).toHaveBeenCalledWith(`OTP verification for: ${email} and code: ${code}`)
  })

  it('should check an email is verified', async () => {
    personOnProbationUserApiClient.getUserByUrn.mockResolvedValue(mockedUserResponse)
    const result = await userService.isVerified(oneLoginTestUrn)
    expect(result).toBe(mockedUserResponse)
    expect(loggerSpy).toHaveBeenCalledWith(`User verification`)
    expect(redisClient.get).toHaveBeenCalledWith(`${oneLoginTestUrn}-popuser-data`)
  })

  it('should fetch the user personal details', async () => {
    resettlementPassportApiClient.getByNomsId.mockResolvedValue(mockedUserDetailsResponse)
    const result = await userService.getByNomsId(mockedUserResponse.nomsId)
    expect(result).toBe(mockedUserDetailsResponse)
    expect(loggerSpy).toHaveBeenCalledWith(`Get personal details by nomsId`)
    expect(redisClient.get).toHaveBeenCalledWith(`${mockedUserResponse.nomsId}-popuserdetails-data`)
  })
})
