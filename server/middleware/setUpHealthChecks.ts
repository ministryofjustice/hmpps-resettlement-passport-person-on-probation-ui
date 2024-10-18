import express, { Router } from 'express'

import healthcheck from '../services/healthCheck'
import type { ApplicationInfo } from '../applicationInfo'

export default function setUpHealthChecks(applicationInfo: ApplicationInfo): Router {
  const router = express.Router()

  router.get('/health', (_, res) => {
    healthcheck(applicationInfo, result => {
      if (result.status !== 'UP') {
        res.status(503)
      }
      res.json(result)
    })
  })

  router.get('/ping', (_, res): void => {
    res.send({
      status: 'UP',
    })
  })

  router.get('/info', (_, res) => {
    res.json({
      git: {
        branch: applicationInfo.branchName,
      },
      build: {
        artifact: applicationInfo.applicationName,
        version: applicationInfo.buildNumber,
        name: applicationInfo.applicationName,
      },
      productId: applicationInfo.productId,
    })
  })

  return router
}
