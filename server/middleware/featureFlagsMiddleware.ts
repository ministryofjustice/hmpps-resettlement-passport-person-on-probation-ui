import { NextFunction, Request, Response } from 'express'
import FeatureFlagsService from '../services/featureFlagsService'

export const featureFlagsMiddleware = (featureFlagsService: FeatureFlagsService) => {
  return (_: Request, res: Response, next: NextFunction) => {
    featureFlagsService
      .getFeatureFlags()
      .then(flags => {
        res.locals.flags = flags
        next()
      })
      .catch(err => {
        next(err)
      })
  }
}
