import UserService from '../services/userService'
import { UserDetailsResponse } from '../data/personOnProbationApiClient'
import { hasUserActivity, setUserActivity } from '../authentication/userActivityTracking'

export default async function requireUser(
  urn: string,
  userService: UserService,
  sessionId: string,
): Promise<UserDetailsResponse | string> {
  if (!urn) {
    return '/sign-in'
  }
  const authenticationData = await userService.isAuthenticated(urn)
  if (!authenticationData) {
    return '/sign-out'
  }
  const verificationData = await userService.getUserDetails(urn, sessionId)
  if (!verificationData?.verified === true) {
    return '/otp'
  }
  const isActive = await hasUserActivity(urn)
  if (!isActive) {
    return '/sign-out-timed'
  }
  await setUserActivity(urn)

  return verificationData
}
