import { Router } from 'express'
import { Services } from '../../services'
import LicenceConditionsController from './licenceConditionsController'

export default (router: Router, services: Services) => {
  const controller = new LicenceConditionsController(
    services.licenceConditionService,
    services.userService,
    services.featureFlagsService,
  )
  router.get('/licence-conditions', [controller.index])
  router.get('/licence-conditions/:licenceId/condition/:conditionId', [controller.view])
}
