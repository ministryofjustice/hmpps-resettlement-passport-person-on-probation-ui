import { Router } from 'express'
import { Services } from '../../services'
import asyncWrapper from '../../middleware/asyncWrapper'
import TodoController from './todoController'

export default (router: Router, services: Services) => {
  const controller = new TodoController(services.todoService, services.userService)
  router.get('/todo', [asyncWrapper(controller.viewList)])
  router.get('/todo/add', [asyncWrapper(controller.viewAddPage)])
  router.post('/todo/add', [asyncWrapper(controller.postItem)])
}
