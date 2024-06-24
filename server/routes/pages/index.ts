import { Router } from 'express'
import PagesController from './pagesController'

export default (router: Router) => {
  const pagesController = new PagesController()
  router.get('/', [pagesController.start])
  router.get('/pages/:id', [pagesController.index])
  router.get('/accessibility', [pagesController.accessibility])
  router.get('/cookies', [pagesController.cookies])
}
