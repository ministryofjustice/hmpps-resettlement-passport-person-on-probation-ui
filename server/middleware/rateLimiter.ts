import express, { Router, Request, Response, NextFunction } from 'express'

const rateLimitedPaths = ['/userSupport/submit', '/otp/verify']

interface RateLimiter {
  [ip: string]: {
    count: number
    lastRequest: number
  }
}

const rateLimiters: RateLimiter = {}

export const rateLimiterMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (rateLimitedPaths.indexOf(req.path) < 0) {
    return next()
  }
  const { ip } = req
  const now = Date.now()
  const limit = 10 // Limit to 10 requests per minute
  const window = 60000 // 1 minute in milliseconds

  if (!rateLimiters[ip]) {
    rateLimiters[ip] = { count: 1, lastRequest: now }
  } else {
    rateLimiters[ip].count += 1
  }

  if (now - rateLimiters[ip].lastRequest > window) {
    rateLimiters[ip].count = 1
    rateLimiters[ip].lastRequest = now
  }

  if (rateLimiters[ip].count > limit) {
    return res.status(429).send('Too Many Requests')
  }
  return next()
}

export function setupRateLimiter(): Router {
  const router = express.Router()
  router.use(rateLimiterMiddleware)
  return router
}
