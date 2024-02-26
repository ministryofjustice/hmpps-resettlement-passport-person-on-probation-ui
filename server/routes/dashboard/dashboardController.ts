import { RequestHandler } from 'express'
import UserService from '../../services/userService'

export default class DashboardController {
  constructor(private readonly userService: UserService) {}

  index: RequestHandler = async (req, res) => {
    const urn = req.user.sub
    const verificationData = await this.userService.isVerified(urn)
    if (!verificationData?.verified === true) {
      return res.redirect('/otp')
    }
    const personalData = await this.userService.getByNomsId(verificationData.nomsId, urn)
    return res.render('pages/dashboard', { user: req.user, personalData })
  }
}
