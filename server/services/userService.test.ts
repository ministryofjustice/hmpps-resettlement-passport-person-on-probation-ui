import UserService from './userService'
import logger from '../../logger'

jest.mock('../../logger')

describe('UserService', () => {
  const userService = new UserService()
  afterEach(() => {
    jest.restoreAllMocks()
  })

  test.each([
    ['test@example.com', '123456', true],
    ['test@example.com', '12', false],
    ['test@example.com', 'abc123', false],
    ['test@example.com', '', false],
  ])('should validate an OTP code', async (email: string, code: string, expectedValid: boolean) => {
    const loggerSpy = jest.spyOn(logger, 'info')
    const result = await userService.checkOtp(email, code)
    expect(result).toBe(expectedValid)
    expect(loggerSpy).toHaveBeenCalledWith(`OTP verification for: ${email} and code: ${code}`)
  })

  it('should check an email is verified', async () => {
    const loggerSpy = jest.spyOn(logger, 'info')
    const result = await userService.isVerified('test@gmail.com')
    expect(result).toBe(true)
    expect(loggerSpy).toHaveBeenCalledWith('User verification: test@gmail.com')
  })
})
