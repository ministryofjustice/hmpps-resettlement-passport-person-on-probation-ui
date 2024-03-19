import { Router } from 'express'
import { Services } from '../../services'
import ProfileController from './profileController'

export default (router: Router, services: Services) => {
  const controller = new ProfileController(services.userService)
  router.get('/profile', [controller.index])
}
