import { Router } from 'express'
import { Services } from '../../services'
import OverviewController from './overviewController'
import asyncWrapper from '../../middleware/asyncWrapper'

export default (router: Router, services: Services) => {
  const controller = new OverviewController(
    services.appointmentService,
    services.userService,
    services.licenceConditionService,
    services.featureFlagsService,
    services.todoService,
  )
  router.get('/overview', [asyncWrapper(controller.index)])
}
