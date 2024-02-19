import { RequestHandler } from 'express'
import UserService from '../../services/userService'

export default class HomeController {
  constructor(private readonly userService: UserService) {}

  index: RequestHandler = async (req, res) => {
    res.render('pages/otp', { user: req.user })
  }

  create: RequestHandler = async (req, res) => {
    const { otp } = req.body

    const isValid = await this.userService.checkOtp(req.user.email, otp)
    if (isValid) {
      req.session.isUserVerified = true
      return res.redirect('/dashboard')
    }
    return res.render('pages/otp', {
      user: req.user,
      error: {
        message: 'Enter a correct security code',
      },
    })
  }
}
