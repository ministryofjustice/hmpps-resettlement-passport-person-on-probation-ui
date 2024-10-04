import type { Request, Response, NextFunction } from 'express'
import type { HTTPError } from 'superagent'
import logger from '../logger'

export const friendlyErrorMessage = 'error-message'

export function createErrorHandler(production: boolean) {
  return (error: HTTPError, req: Request, res: Response, next: NextFunction): void => {
    if (error.status === 404) {
      return res.status(404).render('pages/notFound')
    }

    logger.error(`Error handling request for '${req.originalUrl}', user '${res.locals.user}'`, error)

    res.locals.message = req.t(friendlyErrorMessage)
    res.locals.status = error.status
    res.locals.stack = production ? null : `Error info: ${error.stack}`

    res.status(500)
    return res.render('pages/error', { user: req.user })
  }
}
