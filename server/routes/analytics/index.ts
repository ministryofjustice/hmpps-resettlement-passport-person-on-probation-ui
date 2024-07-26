import { Router } from 'express'
import AnalyticsController from './analyticsController'
import { Services } from '../../services'
import asyncWrapper from '../../middleware/asyncWrapper'

export default (router: Router, services: Services) => {
  const analyticsController = new AnalyticsController(services.appInsightsClient)
  router.post('/track', [asyncWrapper(analyticsController.track)])
}
