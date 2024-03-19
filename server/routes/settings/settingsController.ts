import { RequestHandler } from 'express'
import UserService from '../../services/userService'
import requireUser from '../requireUser'
import config from '../../config'

export default class SettingsController {
  constructor(private readonly userService: UserService) {}

  index: RequestHandler = async (req, res, next) => {
    try {
      const { sub, email, phone_number: phoneNumber } = req.user
      const verificationData = await requireUser(sub, this.userService)
      if (typeof verificationData === 'string') {
        return res.redirect(verificationData)
      }
      const oneloginUrl = config.apis.govukOneLogin.homeUrl
      const phoneEnding = phoneNumber.slice(-4)
      return res.render('pages/settings', { phone: '', email, phoneEnding, oneloginUrl })
    } catch (err) {
      return next(err)
    }
  }
}
