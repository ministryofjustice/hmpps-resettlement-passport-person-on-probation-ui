import { Router } from 'express'
import { Services } from '../../services'
import DashboardController from './dashboardController'

export default (router: Router, services: Services) => {
  const controller = new DashboardController(
    services.appointmentService,
    services.userService,
    services.licenceConditionService,
  )
  router.get('/dashboard', [controller.index])
}
