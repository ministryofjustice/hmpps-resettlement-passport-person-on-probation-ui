import { Router } from 'express'
import TimeoutController from './timeoutController'

export default (router: Router) => {
  const timeoutController = new TimeoutController()
  router.get('/timed-out', [timeoutController.index])
}
