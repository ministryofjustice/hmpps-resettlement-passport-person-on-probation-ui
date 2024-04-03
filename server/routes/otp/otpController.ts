import { RequestHandler } from 'express'
import UserService from '../../services/userService'
import { getDobDate, getDobDateString } from '../../utils/utils'

export default class HomeController {
  constructor(private readonly userService: UserService) {}

  index: RequestHandler = async (req, res) => {
    res.render('pages/otp', { user: req.user })
  }

  create: RequestHandler = async (req, res, next) => {
    try {
      const { otp, 'dob-dobDay': dobDay, 'dob-dobMonth': dobMonth, 'dob-dobYear': dobYear } = req.body
      const errors: Array<Express.ValidationError> = []
      const dobDate = getDobDate(dobDay, dobMonth, dobYear)
      if (!dobDate) {
        errors.push({
          text: 'Enter a valid date of birth',
          href: '#dob',
        })
      }

      const dobDateString = getDobDateString(dobDay, dobMonth, dobYear)

      const isValid = await this.userService.checkOtp(req.user.email, otp, dobDateString, req.user.sub)
      if (isValid) {
        return res.redirect('/dashboard')
      }

      errors.push({
        text: 'Enter a correct security code matching the date of birth provided',
        href: '#otp',
      })

      const otpError = errors.find(x => x.href === '#otp')
      const dobError = errors.find(x => x.href === '#dob')

      return res.render('pages/otp', {
        user: req.user,
        errors,
        otpError,
        dobError,
      })
    } catch (err) {
      return next(err)
    }
  }
}
