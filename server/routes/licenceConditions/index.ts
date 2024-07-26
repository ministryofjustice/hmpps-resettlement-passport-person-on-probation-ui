import { Router } from 'express'
import { Services } from '../../services'
import LicenceConditionsController from './licenceConditionsController'
import asyncWrapper from '../../middleware/asyncWrapper'

export default (router: Router, services: Services) => {
  const controller = new LicenceConditionsController(
    services.licenceConditionService,
    services.userService,
    services.featureFlagsService,
  )
  router.get('/licence-conditions', [asyncWrapper(controller.index)])
  router.post('/licence-conditions', [asyncWrapper(controller.confirm)])
  router.get('/licence-conditions/:licenceId/condition/:conditionId', [asyncWrapper(controller.view)])
}
