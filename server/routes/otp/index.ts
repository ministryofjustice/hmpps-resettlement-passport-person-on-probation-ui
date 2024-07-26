import { Router } from 'express'
import { Services } from '../../services'
import OtpController from './otpController'
import asyncWrapper from '../../middleware/asyncWrapper'

export default (router: Router, services: Services) => {
  const otpController = new OtpController(services.userService, services.appInsightsClient)
  router.get('/otp', [asyncWrapper(otpController.index)])
  router.post('/otp/verify', [asyncWrapper(otpController.create)])
}
