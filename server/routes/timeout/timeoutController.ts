import { RequestHandler } from 'express'
import { TelemetryClient } from 'applicationinsights'
import requireUser from '../requireUser'
import UserService from '../../services/userService'
import config from '../../config'
import { userProperties, trackEvent, PyfEvent } from '../../utils/analytics'

export default class TimeoutController {
  constructor(
    private readonly userService: UserService,
    private readonly appInsightClient: TelemetryClient,
  ) {}

  index: RequestHandler = async (req, res) => {
    const queryParams = req.query
    trackEvent(
      this.appInsightClient,
      PyfEvent.TIMEOUT_EVENT,
      userProperties(req.user?.sub),
      req.user?.sub,
      req.sessionID,
    )

    res.render('pages/timedOut', { queryParams })
  }

  config: RequestHandler = async (req, res) => {
    res.setHeader('Content-Type', 'application/json')
    return res.json({ timeout: config.session.inactivityMinutes * 60000 })
  }

  status: RequestHandler = async (req, res, next) => {
    try {
      const sessionId = req.sessionID
      const verificationData = await requireUser(req.user?.sub, this.userService, sessionId)
      let isActive = true
      if (typeof verificationData === 'string') {
        isActive = false
      }
      res.setHeader('Content-Type', 'application/json')
      return res.json({ isActive })
    } catch (err) {
      return next(err)
    }
  }
}
