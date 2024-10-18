import express, { Router, Request, Response, NextFunction } from 'express'
import config from '../config'
import { minutesToMilliseconds } from 'date-fns'
import logger from '../../logger'

const rateLimitedPaths = ['/feedback/complete', '/sign-up/otp/verify']

type IPAddress = string

interface RequestHistory {
  count: number
  windowStart: number
}

const requestCounts = new Map<IPAddress, RequestHistory>()
const windowLengthMs = config.rateLimit.windowMinutes * 60000 // convert to millis

const isWindowLapsed = (now: number, windowStart: number) => now - windowStart >= windowLengthMs

export const rateLimiterMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  if (rateLimitedPaths.indexOf(req.path) < 0) {
    return next()
  }
  const { ip } = req
  const now = Date.now()

  // initialise or increase
  let requestHistory = requestCounts.get(ip)
  if (requestHistory) {
    requestHistory.count += 1
  } else {
    requestHistory = { count: 1, windowStart: now }
    requestCounts.set(ip, requestHistory)
  }

  // reset counter
  if (isWindowLapsed(now, requestHistory.windowStart)) {
    requestHistory.count = 1
    requestHistory.windowStart = now
  }

  // deny
  if (requestHistory.count > config.rateLimit.maxRequests) {
    res.status(429).send('Too Many Requests')
    return
  }

  // continue
  return next()
}

function cleanupOldRecords() {
  logger.info('Cleaning up rate limiter records')
  const now = Date.now()
  let count = 0

  for (const [key, value] of requestCounts.entries()) {
    if (isWindowLapsed(now, value.windowStart)) {
      requestCounts.delete(key)
      count++
    }
  }

  logger.info('Cleanup finished, cleaned %d records in %d ms', count, Date.now() - now)
}

export function setupRateLimiter(): Router {
  const router = express.Router()
  router.use(rateLimiterMiddleware)
  setInterval(() => cleanupOldRecords(), minutesToMilliseconds(config.rateLimit.cleanupIntervalMinutes))
  return router
}
