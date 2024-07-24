import { Router } from 'express'
import { Services } from '../../services'
import DocumentsController from './documentsController'

export default (router: Router, services: Services) => {
  const controller = new DocumentsController(
    services.featureFlagsService,
    services.documentService,
    services.userService,
  )
  router.get('/documents', [controller.index])
  router.get('/documents/:docId', [controller.viewDocument])
}
