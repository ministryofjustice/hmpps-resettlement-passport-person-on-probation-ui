import { RequestHandler } from 'express'
import { TelemetryClient } from 'applicationinsights'
import { trackEvent } from '../../utils/analytics'

export default class AnalyticsController {
  constructor(private readonly appInsightClient: TelemetryClient) {}

  track: RequestHandler = async (req, res) => {
    const { eventName, type, identifier } = req.body
    if (eventName) {
      trackEvent(
        this.appInsightClient,
        eventName,
        [
          { key: 'type', value: type },
          { key: 'identifier', value: identifier },
        ],
        req.user?.sub,
        req.sessionID,
      )
    }
    return res.status(200)
  }
}
