import { Router } from 'express'
import UserSupportController from './userSupportController'
import { Services } from '../../services'

export default (router: Router, services: Services) => {
  const userSupportController = new UserSupportController(services.zendeskService)
  router.get('/userSupport', [userSupportController.index])
  router.post('/userSupport/submit', [userSupportController.create])
}
