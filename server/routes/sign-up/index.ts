import { Router } from 'express'
import { Services } from '../../services'
import OtpController from './signUpController'
import asyncWrapper from '../../middleware/asyncWrapper'

export default (router: Router, services: Services) => {
  const otpController = new OtpController(services.userService, services.appInsightsClient)
  router.get('/sign-up/otp', [asyncWrapper(otpController.index)])
  router.post('/sign-up/otp/verify', [asyncWrapper(otpController.create)])
}
