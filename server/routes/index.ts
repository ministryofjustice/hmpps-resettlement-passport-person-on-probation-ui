import { Router } from 'express'

import type { Services } from '../services'
import homeRoutes from './home'
import otpRoutes from './otp'
import dashboardRoutes from './dashboard'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function routes(service: Services): Router {
  const router = Router()
  homeRoutes(router)
  otpRoutes(router, service)
  dashboardRoutes(router, service)
  return router
}
