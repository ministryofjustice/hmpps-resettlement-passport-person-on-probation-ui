import UserService from './userService'
import logger from '../../logger'
import ResettlementPassportApiClient from '../data/resettlementPassportApiClient'

jest.mock('../../logger')
jest.mock('../data/resettlementPassportApiClient')

const mockedResponse = {
  id: 3,
  prisoner: {
    id: 2,
    nomsId: 'G4161UF',
    creationDate: '2023-08-29T10:49:36.114432',
    crn: 'U416100',
    prisonId: 'MDI',
    releaseDate: '2024-08-01',
  },
  creationDate: '2024-02-21T11:14:41.939462',
  expiryDate: '2024-02-28T23:59:59.939462',
  otp: 123456,
}

describe('UserService', () => {
  let resettlementPassportApiClient: jest.Mocked<ResettlementPassportApiClient>

  let userService: UserService
  const loggerSpy = jest.spyOn(logger, 'info')

  beforeEach(() => {
    resettlementPassportApiClient = new ResettlementPassportApiClient() as jest.Mocked<ResettlementPassportApiClient>
    userService = new UserService(resettlementPassportApiClient)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  test.each([
    ['test@example.com', '123456', true],
    ['test@example.com', '12', false],
    ['test@example.com', 'abc123', false],
    ['test@example.com', '', false],
  ])('should validate an OTP code', async (email: string, code: string, expectedValid: boolean) => {
    resettlementPassportApiClient.getPopUserOtp.mockResolvedValue(mockedResponse)
    const result = await userService.checkOtp(email, code)
    expect(result).toBe(expectedValid)
    expect(loggerSpy).toHaveBeenCalledWith(`OTP verification for: ${email} and code: ${code}`)
  })

  it('should check an email is verified', async () => {
    const result = await userService.isVerified('test@gmail.com')
    expect(result).toBe(true)
    expect(loggerSpy).toHaveBeenCalledWith('User verification: test@gmail.com')
  })
})
