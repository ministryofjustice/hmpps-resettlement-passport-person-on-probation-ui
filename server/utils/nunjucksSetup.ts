/* eslint-disable no-param-reassign */
import path from 'path'
import nunjucks from 'nunjucks'
import express from 'express'
import {
  initialiseName,
  formatDate,
  formatTime,
  formatAppointmentLocation,
  formatAppointmentNote,
  mapsLinkFromAppointmentLocation,
  pluraliseAppointments,
  formatLicenceDate,
  orElse,
} from './utils'
import { ApplicationInfo } from '../applicationInfo'
import config from '../config'

const production = process.env.NODE_ENV === 'production'

export default function nunjucksSetup(app: express.Express, applicationInfo: ApplicationInfo): void {
  app.set('view engine', 'njk')

  app.locals.asset_path = '/assets/'
  app.locals.applicationName = 'Plan your future'
  app.locals.environmentName = config.environmentName
  app.locals.environmentNameColour = config.environmentName === 'PRE-PRODUCTION' ? 'govuk-tag--green' : ''

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
  njkEnv.addFilter('formatDate', formatDate)
  njkEnv.addFilter('formatLicenceDate', formatLicenceDate)
  njkEnv.addFilter('formatTime', formatTime)
  njkEnv.addFilter('formatAppointmentLocation', formatAppointmentLocation)
  njkEnv.addFilter('formatAppointmentNote', formatAppointmentNote)
  njkEnv.addFilter('mapsLinkFromAppointmentLocation', mapsLinkFromAppointmentLocation)
  njkEnv.addFilter('pluraliseAppointments', pluraliseAppointments)
  njkEnv.addFilter('orElse', orElse)
}
