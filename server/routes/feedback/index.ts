import { Router } from 'express'
import FeedbackController from './feedbackController'
import { Services } from '../../services'
import asyncWrapper from '../../middleware/asyncWrapper'

export default (router: Router, services: Services) => {
  const feedbackController = new FeedbackController(services.zendeskService)
  router.get('/feedback', [asyncWrapper(feedbackController.index)])
  router.get('/feedback/questions', [asyncWrapper(feedbackController.questions)])
  router.post('/feedback/questions/submit', [asyncWrapper(feedbackController.submitQuestions)])
  router.get('/feedback/review', [asyncWrapper(feedbackController.review)])
  router.post('/feedback/complete', [asyncWrapper(feedbackController.submitReview)])
}
