import { Router } from 'express'

import type { Services } from '../services'
import signUpRoutes from './sign-up/signUpRoutes'
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
import todoRoutes from './todo/todoRoutes'

export default function routes(services: Services): Router {
  const router = Router()
  signUpRoutes(router, services)
  overviewRoutes(router, services)
  appointmentRoutes(router, services)
  licenceConditionsRoutes(router, services)
  profileRoutes(router, services)
  settingsRoutes(router, services)
  feedbackRoutes(router, services)
  timeoutRoutes(router, services)
  analyticsRoutes(router, services)
  pagesRoutes(router)
  documentsRoute(router, services)
  todoRoutes(router, services)
  return router
}
