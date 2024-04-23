import type { Request, Response, NextFunction } from 'express'
import type { HTTPError } from 'superagent'
import logger from '../logger'

export const friendlyErrorMessage =
  'We cannot show these details right now. We are aware of the issue and are working to fix it. Please try again later.'

export function createErrorHandler(production: boolean) {
  return (error: HTTPError, req: Request, res: Response, next: NextFunction): void => {
    logger.error(`Error handling request for '${req.originalUrl}', user '${res.locals.user}'`, error)

    if (error.status === 404) {
      return res.render('pages/notFound')
    }

    if (error.status === 401 || error.status === 403 || error.message.indexOf('authorization') > 0) {
      logger.info('Logging user out')
      return res.redirect('/sign-out')
    }

    res.locals.message = friendlyErrorMessage
    res.locals.status = error.status
    res.locals.stack = production ? null : `Error info: ${error.stack}`

    res.status(200)
    return res.render('pages/error')
  }
}
