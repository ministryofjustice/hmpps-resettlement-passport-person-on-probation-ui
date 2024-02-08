import { Router } from 'express'
import HomeController from './homeController'

export default (router: Router) => {
  const homeController = new HomeController()
  router.get('/', [homeController.index])
}
