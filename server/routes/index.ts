import { Router } from 'express'

import type { Services } from '../services'
import homeRoutes from './home'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function routes(service: Services): Router {
  const router = Router()
  homeRoutes(router)
  return router
}
