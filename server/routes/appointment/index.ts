import { Router } from 'express'
import { Services } from '../../services'
import AppointmentController from './appointmentController'

export default (router: Router, services: Services) => {
  const controller = new AppointmentController(
    services.appointmentService,
    services.userService,
    services.featureFlagsService,
  )
  router.get('/appointments', [controller.index])
  router.get('/appointments/:id', [controller.show])
}
