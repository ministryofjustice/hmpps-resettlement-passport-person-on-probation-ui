import { Router } from 'express'
import CookiesController from './cookiesController'

export default (router: Router) => {
  const cookiesController = new CookiesController()
  router.get('/cookies', [cookiesController.index])
}
