import { Router } from 'express'
import { Services } from '../../services'
import ProfileController from './profileController'
import asyncWrapper from '../../middleware/asyncWrapper'

export default (router: Router, services: Services) => {
  const controller = new ProfileController(services.userService, services.featureFlagsService)
  router.get('/profile', [asyncWrapper(controller.index)])
}
