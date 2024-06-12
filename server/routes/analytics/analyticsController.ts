import { RequestHandler } from 'express'
import { trackEvent } from '../../utils/analytics'

export default class AnalyticsController {
  track: RequestHandler = async (req, res) => {
    const { eventName, type, identifier } = req.body
    if (eventName) {
      trackEvent(eventName, [
        { key: 'type', value: type },
        { key: 'identifier', value: identifier },
      ])
    }
    return res.status(200)
  }
}
