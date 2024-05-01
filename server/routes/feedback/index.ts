import { Router } from 'express'
import FeedbackController from './feedbackController'
import { Services } from '../../services'

export default (router: Router, services: Services) => {
  const feedbackController = new FeedbackController(services.zendeskService)
  router.get('/feedback', [feedbackController.index])
  router.get('/feedback/questions', [feedbackController.questions])
  router.get('/feedback/review', [feedbackController.review]) // todo: delete
  router.post('/feedback/review', [feedbackController.review])
  router.post('/feedback/submit', [feedbackController.create])
}
