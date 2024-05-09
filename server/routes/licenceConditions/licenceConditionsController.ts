import { RequestHandler } from 'express'
import UserService from '../../services/userService'
import requireUser from '../requireUser'
import LicenceConditionsService from '../../services/licenceConditionsService'

export default class LicenceConditionsController {
  constructor(
    private readonly licenceConditionsService: LicenceConditionsService,
    private readonly userService: UserService,
  ) {}

  index: RequestHandler = async (req, res, next) => {
    try {
      const queryParams = req.query;
      const sessionId = req.sessionID
      const verificationData = await requireUser(req.user?.sub, this.userService, sessionId)
      if (typeof verificationData === 'string') {
        return res.redirect(verificationData)
      }

      const licence = await this.licenceConditionsService.getLicenceConditionsByNomsId(
        verificationData.nomsId,
        sessionId,
      )

      return res.render('pages/licenceConditions', { user: req.user, licence, queryParams })
    } catch (err) {
      return next(err)
    }
  }

  view: RequestHandler = async (req, res, next) => {
    try {
      const queryParams = req.query;
      const sessionId = req.sessionID
      const verificationData = await requireUser(req.user?.sub, this.userService, sessionId)
      if (typeof verificationData === 'string') {
        return res.redirect(verificationData)
      }
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

      return res.render('pages/licenceConditionsDetails', { user: req.user, condition, image, queryParams })
    } catch (err) {
      return next(err)
    }
  }
}
