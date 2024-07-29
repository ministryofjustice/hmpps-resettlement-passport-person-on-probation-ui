import { Router } from 'express'
import PagesController from './pagesController'
import asyncWrapper from '../../middleware/asyncWrapper'

export default (router: Router) => {
  const pagesController = new PagesController()
  router.get('/', [asyncWrapper(pagesController.start)])
  router.get('/pages/:id', [asyncWrapper(pagesController.index)])
  router.get('/accessibility', [asyncWrapper(pagesController.accessibility)])
  router.get('/cookies', [asyncWrapper(pagesController.cookies)])
  router.get('/privacy', [asyncWrapper(pagesController.privacy)])
}
