import { Router } from 'express'

export default function setUpCurrentUser(): Router {
  const router = Router({ mergeParams: true })
  return router
}
