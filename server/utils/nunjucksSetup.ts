import path from 'path'
import nunjucks from 'nunjucks'
import express from 'express'
import type { I18n } from 'i18n'
import {
  initialiseName,
  formatLongDate,
  formatTime,
  formatAppointmentLocation,
  formatAppointmentNote,
  mapsLinkFromAppointmentLocation,
  pluraliseAppointments,
  formatLicenceDate,
  orElse,
  appendLanguage,
  hiddenClassOnFlag,
  appendLang,
  toProperCase,
  formatShortDate,
  dayOfMonth,
  monthOfYear,
  yearOf,
} from './utils'
import { ApplicationInfo } from '../applicationInfo'
import config from '../config'

const production = process.env.NODE_ENV === 'production'

export default function nunjucksSetup(app: express.Express, applicationInfo: ApplicationInfo, i18n: I18n) {
  app.set('view engine', 'njk')

  app.locals.asset_path = '/assets/'
  app.locals.applicationName = 'Plan your future'
  app.locals.titleHeading = ` - ${app.locals.applicationName} - GOV.UK`
  app.locals.enableApplicationInsights = config.enableApplicationInsights
  app.locals.applicationInsightsConnectionString = process.env.APPLICATIONINSIGHTS_CONNECTION_STRING || ''

  // will add a no-index meta tag unless the environment is production
  if (config.environmentName !== 'PRODUCTION') {
    app.locals.addNoIndexTag = 'true'
  }

  // Cachebusting version string
  if (production) {
    // Version only changes with new commits
    app.locals.version = applicationInfo.gitShortHash
  } else {
    // Version changes every request
    app.use((req, res, next) => {
      res.locals.version = Date.now().toString()
      return next()
    })
  }

  const njkEnv = nunjucks.configure(
    [
      path.join(__dirname, '../../server/views'),
      'node_modules/govuk-frontend/dist/',
      'node_modules/govuk-frontend/dist/components/',
      'node_modules/@ministryofjustice/frontend/',
      'node_modules/@ministryofjustice/frontend/moj/components/',
    ],
    {
      autoescape: true,
      express: app,
      watch: !production,
    },
  )
  njkEnv.addFilter('hasErrorWithPrefix', (errorsArray, prefixes) => {
    if (!errorsArray) return null
    const formattedPrefixes = prefixes.map((field: string) => `#${field}`)
    return errorsArray.some((error: Express.ValidationError) =>
      formattedPrefixes.some((prefix: string) => error.href.startsWith(prefix)),
    )
  })

  njkEnv.addFilter('initialiseName', initialiseName)
  njkEnv.addFilter('formatLongDate', formatLongDate)
  njkEnv.addFilter('formatShortDate', formatShortDate)
  njkEnv.addFilter('formatLicenceDate', formatLicenceDate)
  njkEnv.addFilter('dayOfMonth', dayOfMonth)
  njkEnv.addFilter('monthOfYear', monthOfYear)
  njkEnv.addFilter('yearOf', yearOf)
  njkEnv.addFilter('formatTime', formatTime)
  njkEnv.addFilter('formatAppointmentLocation', formatAppointmentLocation)
  njkEnv.addFilter('formatAppointmentNote', formatAppointmentNote)
  njkEnv.addFilter('mapsLinkFromAppointmentLocation', mapsLinkFromAppointmentLocation)
  njkEnv.addFilter('pluraliseAppointments', pluraliseAppointments)
  njkEnv.addFilter('orElse', orElse)
  njkEnv.addFilter('toProperCase', toProperCase)
  njkEnv.addGlobal('appendLang', appendLang)
  njkEnv.addGlobal('appendLanguage', appendLanguage)
  njkEnv.addGlobal('hiddenClassOnFlag', hiddenClassOnFlag)

  njkEnv.addGlobal('t', i18n.__)

  njkEnv.addGlobal('__', i18n.__)

  return njkEnv
}
