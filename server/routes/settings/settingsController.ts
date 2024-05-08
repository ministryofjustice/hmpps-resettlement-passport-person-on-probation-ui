import { RequestHandler } from 'express'
import UserService from '../../services/userService'
import requireUser from '../requireUser'
import config from '../../config'

export default class SettingsController {
  constructor(private readonly userService: UserService) {}

  index: RequestHandler = async (req, res, next) => {
    try {
      const queryParams = req.query;
      const verificationData = await requireUser(req.user.sub, this.userService)
      if (typeof verificationData === 'string') {
        return res.redirect(verificationData)
      }
      const oneloginUrl = config.apis.govukOneLogin.homeUrl
      return res.render('pages/settings', { oneloginUrl, queryParams })
    } catch (err) {
      return next(err)
    }
  }
}
