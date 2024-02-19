import { Router } from 'express'
import { Services } from '../../services'
import OtpController from './otpController'

export default (router: Router, services: Services) => {
  const otpController = new OtpController(services.userService)
  router.get('/otp', [otpController.index])
  router.post('/otp/verify', [otpController.create])
}
