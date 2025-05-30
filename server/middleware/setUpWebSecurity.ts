import crypto from 'crypto'
import express, { Router, Request, Response, NextFunction } from 'express'
import helmet from 'helmet'

export default function setUpWebSecurity(): Router {
  const router = express.Router()

  // Secure code best practice - see:
  // 1. https://expressjs.com/en/advanced/best-practice-security.html,
  // 2. https://www.npmjs.com/package/helmet
  router.use((_req: Request, res: Response, next: NextFunction) => {
    res.locals.cspNonce = crypto.randomBytes(16).toString('hex')
    next()
  })

  // This nonce allows us to use scripts with the use of the `cspNonce` local, e.g (in a Nunjucks template):
  // <script nonce="{{ cspNonce }}">
  // or
  // <link href="http://example.com/" rel="stylesheet" nonce="{{ cspNonce }}">
  // This ensures only scripts we trust are loaded, and not anything injected into the
  // page by an attacker.

  const scriptSrc = ["'self'", (_req: Request, res: Response) => `'nonce-${res.locals.cspNonce}'`]
  const styleSrc = ["'self'", (_req: Request, res: Response) => `'nonce-${res.locals.cspNonce}'`]
  const connectSrc = ["'self'"]
  const imgSrc = ["'self'", 'data:']
  const fontSrc = ["'self'"]
  const formAction = [`'self'`]

  scriptSrc.push('js.monitor.azure.com')
  connectSrc.push('js.monitor.azure.com')
  connectSrc.push('dc.services.visualstudio.com')
  connectSrc.push('northeurope-0.in.applicationinsights.azure.com//v2/track')

  scriptSrc.push('js.monitor.azure.com')
  connectSrc.push('js.monitor.azure.com')
  connectSrc.push('dc.services.visualstudio.com')
  connectSrc.push('northeurope-0.in.applicationinsights.azure.com//v2/track')

  router.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc,
          styleSrc,
          fontSrc,
          imgSrc,
          formAction,
          connectSrc,
        },
      },
      crossOriginEmbedderPolicy: true,
    }),
  )

  return router
}
