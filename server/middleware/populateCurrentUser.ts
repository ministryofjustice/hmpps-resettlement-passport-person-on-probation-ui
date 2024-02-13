import { RequestHandler } from 'express'
import logger from '../../logger'

export default function populateCurrentUser(): RequestHandler {
  return async (req, res, next) => {
    try {
      if (res.locals.user) {
        const { user } = res.locals
        if (user) {
          res.locals.user = { ...user, ...res.locals.user }
        } else {
          logger.info('No user available')
        }
      }
      next()
    } catch (error) {
      logger.error(error, `Failed to retrieve user for: ${res.locals.user}`)
      next(error)
    }
  }
}
