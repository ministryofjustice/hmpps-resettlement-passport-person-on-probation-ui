import { Router } from 'express'
import { Services } from '../../services'
import DashboardController from './dashboardController'

export default (router: Router, services: Services) => {
  const controller = new DashboardController(services.userService)
  router.get('/dashboard', [controller.index])
}
