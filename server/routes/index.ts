import { type RequestHandler, Router } from 'express'

import asyncMiddleware from '../middleware/asyncMiddleware'
import type { Services } from '../services'
import { pdfOptions } from '../utils/pdfFormat'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function routes(service: Services): Router {
  const router = Router()
  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))

  get('/', (req, res, next) => {
    const filename = `test.pdf`
    res.renderPDF('pages/index', {},
    { filename, pdfOptions: { ...pdfOptions } })
  })

  return router
}
