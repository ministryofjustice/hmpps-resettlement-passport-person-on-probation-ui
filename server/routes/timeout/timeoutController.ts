import { RequestHandler } from 'express'
import requireUser from '../requireUser'
import UserService from '../../services/userService'
import config from '../../config'

export default class TimeoutController {
  constructor(private readonly userService: UserService) {}

  index: RequestHandler = async (req, res) => {
    const queryParams = req.query
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
