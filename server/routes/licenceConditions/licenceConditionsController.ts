import { RequestHandler } from 'express'
import UserService from '../../services/userService'
import requireUser from '../requireUser'
import LicenceConditionsService from '../../services/licenceConditionsService'
import { isDateInPast } from '../../utils/utils'
import FeatureFlagsService, { FeatureFlags } from '../../services/featureFlagsService'

export default class LicenceConditionsController {
  constructor(
    private readonly licenceConditionsService: LicenceConditionsService,
    private readonly userService: UserService,
    private readonly featureFlagsService: FeatureFlagsService,
  ) {}

  index: RequestHandler = async (req, res, next) => {
    try {
      const queryParams = req.query
      const sessionId = req.sessionID
      const verificationData = await requireUser(req.user?.sub, this.userService, sessionId)
      if (typeof verificationData === 'string') {
        return res.redirect(verificationData)
      }

      const viewAppointmentFlag = await this.featureFlagsService.getFeatureFlag(FeatureFlags.VIEW_APPOINTMENTS)

      const licence = await this.licenceConditionsService.getLicenceConditionsByNomsId(
        verificationData.nomsId,
        sessionId,
      )

      const prisoner = await this.userService.getByNomsId(verificationData.nomsId, req.user?.sub, sessionId)

      return res.render('pages/licenceConditions', {
        user: req.user,
        licence,
        isExpired: isDateInPast(licence?.expiryDate),
        isLicenceChanged: licence?.changeStatus,
        viewAppointmentFlag,
        isHomeDetention: prisoner?.personalDetails?.isHomeDetention,
        isRecall: prisoner?.personalDetails?.isRecall,
        queryParams,
      })
    } catch (err) {
      return next(err)
    }
  }

  confirm: RequestHandler = async (req, res, next) => {
    try {
      const { version } = req.body
      const sessionId = req.sessionID
      const verificationData = await requireUser(req.user?.sub, this.userService, sessionId)
      if (typeof verificationData === 'string') {
        return res.redirect(verificationData)
      }

      await this.licenceConditionsService.confirmLicenceConditions(verificationData.nomsId, version, sessionId)

      return res.redirect('licence-conditions')
    } catch (err) {
      return next(err)
    }
  }

  view: RequestHandler = async (req, res, next) => {
    try {
      const queryParams = req.query
      const sessionId = req.sessionID
      const verificationData = await requireUser(req.user?.sub, this.userService, sessionId)
      if (typeof verificationData === 'string') {
        return res.redirect(verificationData)
      }

      const viewAppointmentFlag = await this.featureFlagsService.getFeatureFlag(FeatureFlags.VIEW_APPOINTMENTS)
      const licenceId = typeof req.params.licenceId === 'string' ? parseInt(req.params.licenceId, 10) : -1
      const conditionId = typeof req.params.conditionId === 'string' ? parseInt(req.params.conditionId, 10) : -1

      const licence = await this.licenceConditionsService.getLicenceConditionsByNomsId(
        verificationData.nomsId,
        sessionId,
      )
      const condition = licence.otherLicenseConditions.find(x => x.id === conditionId)
      const image = await this.licenceConditionsService.getLicenceConditionsImage(
        verificationData.nomsId,
        licenceId,
        conditionId,
        req.sessionID,
      )

      return res.render('pages/licenceConditionsDetails', {
        user: req.user,
        condition,
        image,
        viewAppointmentFlag,
        queryParams,
      })
    } catch (err) {
      return next(err)
    }
  }
}
