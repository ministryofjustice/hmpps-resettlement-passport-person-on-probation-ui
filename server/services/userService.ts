import logger from '../../logger'

export default class UserService {
  constructor() {}

  async isVerified(email: string): Promise<boolean> {
    // TODO: implement real service
    logger.info(`User ${email} not verified`)
    return Promise.resolve(false)
  }
}
