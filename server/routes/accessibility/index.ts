import { Router } from 'express'
import AccessibilityController from './accessibilityController'

export default (router: Router) => {
  const accessibilityController = new AccessibilityController()
  router.get('/accessibility', [accessibilityController.index])
}
