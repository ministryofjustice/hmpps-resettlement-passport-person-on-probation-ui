import { Router } from 'express'
import StartController from './startController'

export default (router: Router) => {
  const startController = new StartController()
  router.get('/', [startController.index])
}
