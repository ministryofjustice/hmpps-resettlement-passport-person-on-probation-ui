import { RequestHandler } from 'express'
import { isPast } from 'date-fns'
import UserService from '../../services/userService'
import { getDobDate, getDobDateString, isValidOtp } from '../../utils/utils'

export default class HomeController {
  constructor(private readonly userService: UserService) {}

  index: RequestHandler = async (req, res) => {
    const queryParams = req.query
    if (!req.isAuthenticated()) {
      return res.redirect('/sign-in')
    }
    return res.render('pages/otp', { user: req.user, queryParams })
  }

  create: RequestHandler = async (req, res, next) => {
    const queryParams = req.query
    if (!req.isAuthenticated()) {
      return res.redirect('/sign-in')
    }
    try {
      const { otp, 'dob-dobDay': dobDay, 'dob-dobMonth': dobMonth, 'dob-dobYear': dobYear } = req.body
      const errors: Array<Express.ValidationError> = []
      const dobDate = getDobDate(dobDay, dobMonth, dobYear)
      if (!dobDate) {
        errors.push({
          text: req.t('otp-error-date-1'),
          href: '#dob',
        })
      }
      if (!isPast(dobDate)) {
        errors.push({
          text: req.t('otp-error-date-2'),
          href: '#dob',
        })
      }

      const dobDateString = getDobDateString(dobDay, dobMonth, dobYear)

      if (!isValidOtp(otp)) {
        errors.push({
          text: req.t('otp-error-otp-1'),
          href: '#otp',
        })
      } else {
        const isAccepted = await this.userService.checkOtp(
          req.user.email,
          otp,
          dobDateString,
          req.user.sub,
          req.sessionID,
        )
        if (isAccepted) {
          return res.redirect('/dashboard')
        }

        errors.push({
          text: req.t('otp-error-otp-2'),
          href: '#otp',
        })
      }

      const otpError = errors.find(x => x.href === '#otp')
      const dobError = errors.find(x => x.href === '#dob')

      return res.render('pages/otp', {
        user: req.user,
        errors,
        otpError,
        dobError,
        queryParams,
      })
    } catch (err) {
      return next(err)
    }
  }
}
