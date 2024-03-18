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
      const verificationData = await requireUser(req.user?.sub, this.userService)
      if (typeof verificationData === 'string') {
        return res.redirect(verificationData)
      }

      const licence = await this.licenceConditionsService.getLicenceConditionsByNomsId(verificationData.nomsId)

      return res.render('pages/licenceConditions', { user: req.user, licence })
    } catch (err) {
      return next(err)
    }
  }

  view: RequestHandler = async (req, res, next) => {
    try {
      const verificationData = await requireUser(req.user?.sub, this.userService)
      if (typeof verificationData === 'string') {
        return res.redirect(verificationData)
      }
      const licenceId = typeof req.params.licenceId === 'string' ? parseInt(req.params.licenceId, 10) : -1
      const conditionId = typeof req.params.conditionId === 'string' ? parseInt(req.params.conditionId, 10) : -1

      const licence = await this.licenceConditionsService.getLicenceConditionsByNomsId(verificationData.nomsId)
      const condition = licence.otherLicenseConditions.find(x => x.id === conditionId)
      const image = await this.licenceConditionsService.getLicenceConditionsImage(
        verificationData.nomsId,
        licenceId,
        conditionId,
      )

      return res.render('pages/licenceConditionsDetails', { user: req.user, condition, image })
    } catch (err) {
      return next(err)
    }
  }
}
