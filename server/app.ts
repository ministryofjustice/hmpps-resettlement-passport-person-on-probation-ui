import express from 'express'

import createError from 'http-errors'

import i18n from 'i18n'
import cookieParser from 'cookie-parser'
import nunjucksSetup from './utils/nunjucksSetup'
import { createErrorHandler } from './errorHandler'
import { metricsMiddleware } from './monitoring/metricsApp'

import setupGovukOneLogin from './middleware/setupGovukOneLogin'
import setUpCsrf from './middleware/setUpCsrf'
import setUpHealthChecks from './middleware/setUpHealthChecks'
import setUpStaticResources from './middleware/setUpStaticResources'
import setUpWebRequestParsing from './middleware/setupRequestParsing'
import setUpWebSecurity from './middleware/setUpWebSecurity'
import setUpWebSession from './middleware/setUpWebSession'
import routes from './routes'
import type { Services } from './services'
import { setupRateLimiter } from './middleware/rateLimiter'

export default function createApp(services: Services): express.Application {
  const app = express()

  i18n.configure({
    locales: ['en', 'cy'],
    queryParameter: 'lang',
    cookie: 'lang_cookie_name',
    directory: `${__dirname}/views/locales`,
    api: {
      __: 't', // now req.__ becomes req.t
      __n: 'tn', // and req.__n can be called as req.tn
    },
  })

  app.set('json spaces', 2)
  app.set('trust proxy', true)
  app.set('port', process.env.PORT || 3000)
  app.use(cookieParser())
  app.use(metricsMiddleware)
  app.use(setUpHealthChecks(services.applicationInfo))
  app.use(setUpWebSecurity())
  app.use(setUpWebSession())
  app.use(setUpWebRequestParsing())
  app.use(setUpStaticResources())

  const njkEnv = nunjucksSetup(app, services.applicationInfo)
  // eslint-disable-next-line no-underscore-dangle
  njkEnv.addGlobal('__', i18n.__)
  // eslint-disable-next-line no-underscore-dangle
  njkEnv.addFilter('t', i18n.__)
  app.use(i18n.init)

  app.use(setupGovukOneLogin())
  app.use(setUpCsrf())
  app.use(setupRateLimiter())

  app.use(routes(services))

  app.use((req, res, next) => next(createError(404, 'Not found')))
  app.use(createErrorHandler(process.env.NODE_ENV === 'production'))

  return app
}
