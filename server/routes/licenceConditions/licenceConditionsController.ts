import { RequestHandler } from 'express'
import UserService from '../../services/userService'
import requireUser from '../requireUser'
import LicenceConditionsService from '../../services/licenceConditionsService'
import { isDateInPast } from '../../utils/utils'
import FeatureFlagsService from '../../services/featureFlagsService'
import DocumentService from '../../services/documentService'
import { FeatureFlagKey } from '../../services/featureFlags'

export default class LicenceConditionsController {
  constructor(
    private readonly licenceConditionsService: LicenceConditionsService,
    private readonly userService: UserService,
    private readonly featureFlagsService: FeatureFlagsService,
    private readonly documentService: DocumentService,
  ) {}

  index: RequestHandler = async (req, res, next) => {
    try {
      const queryParams = req.query
      const sessionId = req.sessionID
      const verificationData = await requireUser(req.user?.sub, this.userService, sessionId)
      if (typeof verificationData === 'string') {
        return res.redirect(verificationData)
      }

      const [flags, licence, prisoner] = await Promise.all([
        this.featureFlagsService.getFeatureFlags(),
        this.licenceConditionsService.getLicenceConditionsByNomsId(verificationData.nomsId, sessionId),
        this.userService.getByNomsId(verificationData.nomsId, req.user?.sub, sessionId),
      ])

      const isRecall = prisoner?.personalDetails?.isRecall === true
      const isInactive = licence?.status !== 'ACTIVE'
      let showDocument = false
      if (flags.isEnabled(FeatureFlagKey.DOCUMENTS) && (isInactive || isDateInPast(licence?.expiryDate) || isRecall)) {
        // Only look this up if there is no active licence conditions as we won't use it otherwise
        const docs = await this.documentService.getLicenceConditionsDocuments(verificationData.nomsId, sessionId)
        showDocument = docs?.length > 0
      }

      return res.render('pages/licenceConditions', {
        user: req.user,
        licence,
        isExpired: isDateInPast(licence?.expiryDate),
        isLicenceChanged: licence?.changeStatus,
        flags,
        isHomeDetention: prisoner?.personalDetails?.isHomeDetention,
        isRecall,
        queryParams,
        isInactive,
        showDocument,
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

      const flags = await this.featureFlagsService.getFeatureFlags()
      const licenceId = typeof req.params.licenceId === 'string' ? parseInt(req.params.licenceId, 10) : -1
      const conditionId = typeof req.params.conditionId === 'string' ? parseInt(req.params.conditionId, 10) : -1

      const licence = await this.licenceConditionsService.getLicenceConditionsByNomsId(
        verificationData.nomsId,
        sessionId,
      )

      if (licence.licenceId !== licenceId) {
        return res.status(404).render('pages/notFound', { user: req.user })
      }

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
        flags,
        queryParams,
      })
    } catch (err) {
      return next(err)
    }
  }
}
