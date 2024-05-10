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
          text: 'Enter a date of birth in the correct format',
          href: '#dob',
        })
      }

      if (dobDate) {
        if (!isPast(dobDate)) {
          errors.push({
            text: 'The date of birth must be in the past',
            href: '#dob',
          })
        }

        const dobDateString = getDobDateString(dobDay, dobMonth, dobYear)

        if (!isValidOtp(otp)) {
          errors.push({
            text: 'Enter a First-time ID code in the correct format',
            href: '#otp',
          })
        }

        if (isValidOtp(otp)) {
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
            text: 'The First-time ID code entered is not associated with the date of birth provided',
            href: '#otp',
          })
        }
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
