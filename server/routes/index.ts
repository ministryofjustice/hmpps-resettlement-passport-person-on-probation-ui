import { Router } from 'express'

import type { Services } from '../services'
import otpRoutes from './otp'
import overviewRoutes from './overview'
import appointmentRoutes from './appointment'
import licenceConditionsRoutes from './licenceConditions'
import profileRoutes from './profile'
import settingsRoutes from './settings'
import feedbackRoutes from './feedback'
import timeoutRoutes from './timeout'
import analyticsRoutes from './analytics'
import pagesRoutes from './pages'
import documentsRoute from './documents/documentsRoute'

export default function routes(service: Services): Router {
  const router = Router()
  otpRoutes(router, service)
  overviewRoutes(router, service)
  appointmentRoutes(router, service)
  licenceConditionsRoutes(router, service)
  profileRoutes(router, service)
  settingsRoutes(router, service)
  feedbackRoutes(router, service)
  timeoutRoutes(router, service)
  analyticsRoutes(router, service)
  pagesRoutes(router)
  documentsRoute(router, service)
  return router
}
