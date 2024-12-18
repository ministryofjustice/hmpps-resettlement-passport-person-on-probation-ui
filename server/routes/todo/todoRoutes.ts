import { Router } from 'express'
import { Services } from '../../services'
import asyncWrapper from '../../middleware/asyncWrapper'
import TodoController from './todoController'

export default (router: Router, services: Services) => {
  const controller = new TodoController(services.todoService, services.userService, services.featureFlagsService)
  router.get('/todo', [asyncWrapper(controller.viewList)])
  router.get('/todo/add', [asyncWrapper(controller.viewAddPage)])
  router.post('/todo/add', [asyncWrapper(controller.postItem)])
  router.post('/todo/item/:itemId/complete', [asyncWrapper(controller.itemCompleted)])
  router.post('/todo/item/:itemId/not-completed', [asyncWrapper(controller.itemNotCompeted)])
  router.get('/todo/item/:itemId/edit', [asyncWrapper(controller.viewEditPage)])
  router.post('/todo/item/:itemId/edit', [asyncWrapper(controller.postEdit)])
  router.post('/todo/item/:itemId/delete', [asyncWrapper(controller.deleteItem)])
}
