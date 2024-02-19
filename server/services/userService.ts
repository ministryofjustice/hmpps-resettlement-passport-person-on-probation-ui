import logger from '../../logger'

const otpRegex = new RegExp('\\d{6}')

export default class UserService {
  constructor() {}

  async checkOtp(email: string, otp: string): Promise<boolean> {
    logger.info(`OTP verification for: ${email} and code: ${otp}`)
    return Promise.resolve(otpRegex.test(otp))
  }

  async isVerified(email: string): Promise<boolean> {
    logger.info(`User verification: ${email}`)
    return Promise.resolve(true)
  }
}
