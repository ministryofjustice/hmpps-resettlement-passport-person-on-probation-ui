import { RequestHandler } from 'express'
import UserService from '../../services/userService'
import requireUser from '../requireUser'
import config from '../../config'
import FeatureFlagsService, { FeatureFlags } from '../../services/featureFlagsService'

export default class SettingsController {
  constructor(
    private readonly userService: UserService,
    private readonly featureFlagsService: FeatureFlagsService,
  ) {}

  index: RequestHandler = async (req, res, next) => {
    try {
      const queryParams = req.query
      const verificationData = await requireUser(req.user.sub, this.userService, req.sessionID)
      if (typeof verificationData === 'string') {
        return res.redirect(verificationData)
      }

      const viewAppointmentFlag = await this.featureFlagsService.getFeatureFlag(FeatureFlags.VIEW_APPOINTMENTS)

      const oneloginUrl = config.apis.govukOneLogin.homeUrl
      return res.render('pages/settings', { oneloginUrl, viewAppointmentFlag, queryParams })
    } catch (err) {
      return next(err)
    }
  }
}
