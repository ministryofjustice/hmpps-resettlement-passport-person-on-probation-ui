import { Router } from 'express'
import { Services } from '../../services'
import OverviewController from './overviewController'

export default (router: Router, services: Services) => {
  const controller = new OverviewController(
    services.appointmentService,
    services.userService,
    services.licenceConditionService,
    services.featureFlagsService,
  )
  router.get('/overview', [controller.index])
}
