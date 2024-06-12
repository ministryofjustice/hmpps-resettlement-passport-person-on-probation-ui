import { Router } from 'express'
import TimeoutController from './timeoutController'
import { Services } from '../../services'

export default (router: Router, services: Services) => {
  const timeoutController = new TimeoutController(services.userService, services.appInsightsClient)
  router.get('/timed-out', timeoutController.index)
  router.get('/timeout-status', timeoutController.status)
  router.get('/timeout-config', timeoutController.config)
}
