import { Router } from 'express'
import OtpController from './otpController'

export default (router: Router) => {
  const otpController = new OtpController()
  router.get('/otp', [otpController.index])
}
