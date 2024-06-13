import { Router } from 'express'
import ArticleController from './articleController'
import { Services } from '../../services'

export default (router: Router, services: Services) => {
  const articleController = new ArticleController()
  router.get('/resettle-after-prison/:id', [articleController.index])
}
