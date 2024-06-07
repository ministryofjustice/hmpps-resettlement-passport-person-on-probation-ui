import config from '../config'
import logger from '../../logger'
import { tokenStoreFactory } from '../data/tokenStore/tokenStore'

export const USER_ACTIVITY_SESSION_TOKEN = '-activity-session'

export const setUserActivity = async (urn: string) => {
  logger.info(`User activity session set: ${urn}`)
  const tokenStore = tokenStoreFactory()
  const now = new Date().toUTCString()
  await tokenStore.setToken(urn + USER_ACTIVITY_SESSION_TOKEN, now, config.session.inactivityMinutes * 60)
}

export const hasUserActivity = async (urn: string): Promise<boolean> => {
  logger.info(`User activity session check: ${urn}`)
  const tokenStore = tokenStoreFactory()
  const tokenValue = await tokenStore.getToken(urn + USER_ACTIVITY_SESSION_TOKEN)
  return Promise.resolve(!!tokenValue)
}
