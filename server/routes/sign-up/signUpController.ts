import { RequestHandler } from 'express'
import { isPast } from 'date-fns'
import { TelemetryClient } from 'applicationinsights'
import UserService from '../../services/userService'
import { getDobDate, getDobDateString, isValidOtp } from '../../utils/utils'
import { errorProperties, PyfEvent, trackEvent } from '../../utils/analytics'
import FeatureFlagsService from '../../services/featureFlagsService'
import { FeatureFlagKey } from '../../services/featureFlags'

export default class SignupController {
  constructor(
    private readonly userService: UserService,
    private readonly appInsightClient: TelemetryClient,
    private readonly featureFlagsService: FeatureFlagsService,
  ) {}

  otp: RequestHandler = async (req, res) => {
    const queryParams = req.query
    if (!req.isAuthenticated()) {
      return res.redirect('/sign-in')
    }
    if (await this.userService.isVerified(req.user?.sub, req.sessionID)) {
      return res.redirect('/overview')
    }
    const flags = await this.featureFlagsService.getFeatureFlags()

    return res.render('pages/otp', { user: req.user, queryParams, flags })
  }

  create: RequestHandler = async (req, res, next) => {
    const queryParams = req.query
    if (!req.isAuthenticated()) {
      return res.redirect('/sign-in')
    }
    if (await this.userService.isVerified(req.user?.sub, req.sessionID)) {
      return res.redirect('/overview')
    }
    try {
      const { otp, 'dob-dobDay': dobDay, 'dob-dobMonth': dobMonth, 'dob-dobYear': dobYear } = req.body
      const errors: Array<Express.ValidationError> = []
      const dobDate = getDobDate(dobDay, dobMonth, dobYear)

      if (!isValidOtp(otp)) {
        errors.push({
          text: req.t('otp-error-otp-1'),
          href: '#otp',
        })
      }

      if (!dobDate) {
        errors.push({
          text: req.t('otp-error-date-1'),
          href: '#dob',
        })
      } else if (!isPast(dobDate)) {
        errors.push({
          text: req.t('otp-error-date-2'),
          href: '#dob',
        })
      }

      if (dobDate) {
        const dobDateString = getDobDateString(dobDay, dobMonth, dobYear)

        if (isValidOtp(otp)) {
          const isAccepted = await this.userService.checkOtp(
            req.user.email,
            otp,
            dobDateString,
            req.user.sub,
            req.sessionID,
          )
          if (isAccepted) {
            return res.redirect('/overview')
          }

          errors.push({
            text: req.t('otp-error-otp-2'),
            href: '#otp',
          })
        }
      }

      const otpError = errors.find(x => x.href === '#otp')
      const dobError = errors.find(x => x.href === '#dob')

      trackEvent(
        this.appInsightClient,
        PyfEvent.REGISTRATION_ERROR_EVENT,
        errorProperties(errors, req.user?.sub),
        req.user?.sub,
        req.sessionID,
      )
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

  verify: RequestHandler = async (req, res, next) => {
    const flags = await this.featureFlagsService.getFeatureFlags()
    if (!flags.isEnabled(FeatureFlagKey.KNOWLEDGE_VERIFICATION)) {
      return res.redirect('/sign-up/otp')
    }
    return res.render('pages/verification', { flags })
  }
}
