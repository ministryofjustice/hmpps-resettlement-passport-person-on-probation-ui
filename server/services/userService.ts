import logger from '../../logger'
import ResettlementPassportApiClient from '../data/resettlementPassportApiClient'

export default class UserService {
  constructor(private readonly resettlementPassportClient: ResettlementPassportApiClient) {}

  async checkOtp(email: string, otp: string): Promise<boolean> {
    logger.info(`OTP verification for: ${email} and code: ${otp}`)
    const user = await this.resettlementPassportClient.getPopUserOtp('G4161UF')
    logger.info('Testing resettlementPassportClient connectivity got response: ', user)
    return user.otp.toString() === otp
  }

  async isVerified(email: string): Promise<boolean> {
    logger.info(`User verification: ${email}`)
    return Promise.resolve(true)
  }
}
