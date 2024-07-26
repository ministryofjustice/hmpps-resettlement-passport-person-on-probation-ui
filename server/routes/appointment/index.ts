import { Router } from 'express'
import { Services } from '../../services'
import AppointmentController from './appointmentController'
import asyncWrapper from '../../middleware/asyncWrapper'

export default (router: Router, services: Services) => {
  const controller = new AppointmentController(
    services.appointmentService,
    services.userService,
    services.featureFlagsService,
  )
  router.get('/appointments', [asyncWrapper(controller.index)])
  router.get('/appointments/:id', [asyncWrapper(controller.show)])
}
