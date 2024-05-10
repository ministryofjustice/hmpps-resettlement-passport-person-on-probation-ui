import type { Request, Response, NextFunction } from 'express'
import type { HTTPError } from 'superagent'
import logger from '../logger'

export const friendlyErrorMessage = 'error-message'

export function createErrorHandler(production: boolean) {
  return (error: HTTPError, req: Request, res: Response, next: NextFunction): void => {
    logger.error(`Error handling request for '${req.originalUrl}', user '${res.locals.user}'`, error)

    if (error.status === 404) {
      return res.render('pages/notFound')
    }

    if (error.status === 401 || error.status === 403 || error.message.indexOf('authorization') > 0) {
      return res.render('pages/autherror', { user: req.user })
    }

    res.locals.message = req.t(friendlyErrorMessage)
    res.locals.status = error.status
    res.locals.stack = production ? null : `Error info: ${error.stack}`

    res.status(200)
    return res.render('pages/error')
  }
}
