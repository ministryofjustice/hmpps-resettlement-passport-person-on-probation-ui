import { RequestHandler } from 'express'
import UserService from '../../services/userService'

export default class DashboardController {
  constructor(private readonly userService: UserService) {}

  index: RequestHandler = async (req, res) => {
    const isVerified = await this.userService.isVerified(req.user.email)
    if (!isVerified) {
      return res.redirect('/otp')
    }
    return res.render('pages/dashboard', { user: req.user })
  }
}
