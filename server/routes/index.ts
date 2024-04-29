import { Router } from 'express'

import type { Services } from '../services'
import homeRoutes from './home'
import otpRoutes from './otp'
import dashboardRoutes from './dashboard'
import appointmentRoutes from './appointment'
import licenceConditionsRoutes from './licenceConditions'
import profileRoutes from './profile'
import settingsRoutes from './settings'
import cookiesRoutes from './cookies'
import accessibilityRoutes from './accessibility'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function routes(service: Services): Router {
  const router = Router()
  homeRoutes(router)
  otpRoutes(router, service)
  dashboardRoutes(router, service)
  appointmentRoutes(router, service)
  licenceConditionsRoutes(router, service)
  profileRoutes(router, service)
  settingsRoutes(router, service)
  cookiesRoutes(router)
  accessibilityRoutes(router)
  return router
}
