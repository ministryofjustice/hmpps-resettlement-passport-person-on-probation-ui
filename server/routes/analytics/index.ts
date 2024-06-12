import { Router } from 'express'
import AnalyticsController from './analyticsController'

export default (router: Router) => {
  const analyticsController = new AnalyticsController()
  router.post('/track', analyticsController.track)
}
