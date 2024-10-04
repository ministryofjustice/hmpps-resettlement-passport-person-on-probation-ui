import { RequestHandler } from 'express'
import { isPast } from 'date-fns'
import { TelemetryClient } from 'applicationinsights'
import UserService from '../../services/userService'
import { getDateFromDayMonthYear, getDobDateString, isValidOtp } from '../../utils/utils'
import { errorProperties, PyfEvent, trackEvent } from '../../utils/analytics'
import FeatureFlagsService from '../../services/featureFlagsService'
import { FeatureFlagKey } from '../../services/featureFlags'
import { VerificationData } from '../../data/resettlementPassportData'

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
      const dobDate = getDateFromDayMonthYear(dobDay, dobMonth, dobYear)

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

  verifyPage: RequestHandler = async (req, res, _) => {
    const redirect = await this.checkForRedirects(req)
    if (redirect) {
      return res.redirect(redirect)
    }

    return res.render('pages/verification')
  }

  verifySubmit: RequestHandler = async (req, res, _) => {
    const redirect = await this.checkForRedirects(req)
    if (redirect) {
      return res.redirect(redirect)
    }
    let validationResult = validateSubmission(req)
    if (validationResult.errors.length > 0) {
      return res.render('pages/verification', { validationResult, previousSubmission: req.body })
    }

    const submission: VerificationData = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      urn: req.user.sub,
      email: req.user.email,
      dateOfBirth: getDobDateString(req.body['dob-day'], req.body['dob-month'], req.body['dob-year']),
      nomsId: req.body.prisonerNumber,
    }

    const verified = await this.userService.verifyUser(submission, req.sessionID)
    if (verified) {
      return res.redirect('/overview')
    }

    validationResult = {
      errors: [
        {
          text: req.t('verification-error-details-incorrect'),
          href: '',
        },
      ],
    }
    return res.render('pages/verification', { previousSubmission: req.body, validationResult })
  }

  private async checkForRedirects(req: Express.Request): Promise<string | null> {
    const flags = await this.featureFlagsService.getFeatureFlags()
    if (!req.isAuthenticated()) {
      return '/sign-in'
    }
    if (!flags.isEnabled(FeatureFlagKey.KNOWLEDGE_VERIFICATION)) {
      return '/sign-up/otp'
    }
    if (await this.userService.isVerified(req.user?.sub, req.sessionID)) {
      return '/overview'
    }
    return null
  }
}

export type VerifyFormBody = {
  firstName?: string
  lastName?: string
  'dob-day'?: string
  'dob-month'?: string
  'dob-year'?: string
  prisonerNumber?: string
}

type ValidationResult = {
  errors: Express.ValidationError[]
  firstName?: string
  lastName?: string
  dateOfBirth?: string
  prisonerNumber?: string
}

export function validateSubmission(req: Express.Request): ValidationResult {
  const errors: Express.ValidationError[] = []
  const body: VerifyFormBody = req.body
  const result: ValidationResult = {
    errors,
  }

  if (!body.firstName?.length) {
    const message = req.t('verification-error-first-name')
    errors.push({
      text: message,
      href: '#first-name',
    })
    result.firstName = message
  }

  if (!body.lastName) {
    const message = req.t('verification-error-last-name')
    errors.push({
      text: message,
      href: '#last-name',
    })
    result.lastName = message
  }

  const dateOfBirth = getDateFromDayMonthYear(body['dob-day'], body['dob-month'], body['dob-year'])
  if (!dateOfBirth) {
    const message = req.t('verification-error-date-1')
    errors.push({
      text: message,
      href: '#dob',
    })
    result.dateOfBirth = message
  } else if (!isPast(dateOfBirth)) {
    const message = req.t('verification-error-date-2')
    errors.push({
      text: message,
      href: '#dob',
    })
    result.dateOfBirth = message
  }

  if (!body.prisonerNumber) {
    const message = req.t('verification-error-prisoner-number')
    errors.push({
      text: message,
      href: '#prisoner-number',
    })
    result.prisonerNumber = message
  } else if (!body.prisonerNumber.match(/[a-zA-Z0-9]+/)) {
    const message = req.t('verification-error-prisoner-number-2')
    errors.push({
      text: message,
      href: '#prisoner-number',
    })
    result.prisonerNumber = message
  }

  return result
}
