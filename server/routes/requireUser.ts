import UserService from '../services/userService'
import { UserDetailsResponse } from '../data/personOnProbationApiClient'

export default async function requireUser(
  urn: string,
  userService: UserService,
): Promise<UserDetailsResponse | string> {
  if (!urn) {
    return '/'
  }
  const verificationData = await userService.isVerified(urn)
  if (!verificationData?.verified === true) {
    return '/otp'
  }
  return verificationData
}
