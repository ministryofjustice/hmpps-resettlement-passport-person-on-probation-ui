export default class UserService {
  constructor() {}

  async isVerified(email: string): Promise<boolean> {
    // TODO: implement real service
    console.log(`User ${email} not verified`)
    return Promise.resolve(false)
  }
}
