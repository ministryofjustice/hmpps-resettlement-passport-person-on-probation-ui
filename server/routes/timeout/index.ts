import { Router } from 'express'
import TimeoutController from './timeoutController'
import { Services } from '../../services'
import asyncWrapper from '../../middleware/asyncWrapper'

export default (router: Router, services: Services) => {
  const timeoutController = new TimeoutController(services.userService, services.appInsightsClient)
  router.get('/timed-out', [asyncWrapper(timeoutController.index)])
  router.get('/timeout-status', [asyncWrapper(timeoutController.status)])
  router.get('/timeout-config', [asyncWrapper(timeoutController.config)])
}
