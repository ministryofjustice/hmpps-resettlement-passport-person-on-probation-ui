import express, { Router, Request, Response, NextFunction } from 'express'
import config from '../config'

const rateLimitedPaths = ['/feedback/complete', '/otp/verify']

interface RateLimiter {
  [ip: string]: {
    count: number
    lastRequest: number
  }
}

const rateLimiters: RateLimiter = {}

const isWindowLapsed = (now: number, ip: string, window: number) => now - rateLimiters[ip].lastRequest >= window

const isLimitExceeded = (ip: string, limit: number) => rateLimiters[ip].count > limit

export const rateLimiterMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (rateLimitedPaths.indexOf(req.path) < 0) {
    return next()
  }
  const { ip } = req
  const now = Date.now()
  const limit = config.rateLimitPerMinute // Limit to x requests per minute
  const window = 60000 // 1 minute in milliseconds

  // initialise or increase
  if (!rateLimiters[ip]) {
    rateLimiters[ip] = { count: 1, lastRequest: now }
  } else {
    rateLimiters[ip].count += 1
  }

  // reset counter
  if (isLimitExceeded(ip, limit) && isWindowLapsed(now, ip, window)) {
    rateLimiters[ip].count = 0
  }

  rateLimiters[ip].lastRequest = now

  // deny
  if (isLimitExceeded(ip, limit)) {
    return res.status(429).send('Too Many Requests')
  }

  // continue
  return next()
}

export function setupRateLimiter(): Router {
  const router = express.Router()
  router.use(rateLimiterMiddleware)
  return router
}
