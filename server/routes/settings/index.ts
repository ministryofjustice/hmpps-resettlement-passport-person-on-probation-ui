import { Router } from 'express'
import { Services } from '../../services'
import SettingsController from './settingsController'
import asyncWrapper from '../../middleware/asyncWrapper'

export default (router: Router, services: Services) => {
  const controller = new SettingsController(services.userService, services.featureFlagsService)
  router.get('/settings', [asyncWrapper(controller.index)])
}
