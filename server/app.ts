import express from 'express'

import createError from 'http-errors'

import i18n from 'i18n'
import path from 'path'
import fs from 'fs'
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
import { appInsightsMiddleware } from './utils/azureAppInsights'

export default function createApp(services: Services): express.Application {
  const app = express()

  const templatesDir = path.join(__dirname, '/views/locales')

  if (!fs.existsSync(templatesDir)) {
    throw new Error('Locales directory not found!')
  }

  i18n.configure({
    locales: ['en', 'cy'],
    queryParameter: 'lang',
    cookie: 'lang_cookie_name',
    directory: templatesDir,
    api: {
      __: 't', // now req.__ becomes req.t
      __n: 'tn', // and req.__n can be called as req.tn
    },
  })

  app.set('json spaces', 2)
  app.set('trust proxy', true)
  app.set('port', process.env.PORT || 3000)
  app.use(appInsightsMiddleware())
  app.use(metricsMiddleware)
  app.use(setUpHealthChecks(services.applicationInfo))
  app.use(setUpWebSecurity())
  app.use(setUpWebSession())
  app.use(setUpWebRequestParsing())
  app.use(setUpStaticResources())
  
  nunjucksSetup(app, services.applicationInfo, i18n)
  app.use(i18n.init)
  app.use(setupGovukOneLogin())
  app.use(setUpCsrf())
  app.use(setupRateLimiter())

  app.use(routes(services))

  app.use((req, res, next) => next(createError(404, 'Not found')))
  app.use(createErrorHandler(process.env.NODE_ENV === 'production'))

  return app
}
