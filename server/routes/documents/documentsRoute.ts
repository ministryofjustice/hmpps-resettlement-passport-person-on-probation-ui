import { Router } from 'express'
import { Services } from '../../services'
import DocumentsController from './documentsController'
import asyncWrapper from '../../middleware/asyncWrapper'

export default (router: Router, services: Services) => {
  const controller = new DocumentsController(
    services.featureFlagsService,
    services.documentService,
    services.userService,
  )
  router.get('/documents', [asyncWrapper(controller.index)])
  router.get('/documents/:docType', [asyncWrapper(controller.viewDocument)])
}
