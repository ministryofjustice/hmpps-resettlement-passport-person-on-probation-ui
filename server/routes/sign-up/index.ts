import { Router } from 'express'
import { Services } from '../../services'
import SignupController from './signUpController'
import asyncWrapper from '../../middleware/asyncWrapper'

export default (router: Router, services: Services) => {
  const otpController = new SignupController(
    services.userService,
    services.appInsightsClient,
    services.featureFlagsService,
  )
  router.get('/sign-up/otp', [asyncWrapper(otpController.otp)])
  router.post('/sign-up/otp/verify', [asyncWrapper(otpController.create)])
  router.get('/sign-up/verify', [asyncWrapper(otpController.verify)])
}
