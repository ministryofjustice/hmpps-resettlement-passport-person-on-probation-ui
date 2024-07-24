import { RequestHandler } from 'express'
import UserService from '../../services/userService'
import requireUser from '../requireUser'
import config from '../../config'
import FeatureFlagsService from '../../services/featureFlagsService'

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

      const flags = await this.featureFlagsService.getFeatureFlags()

      const oneloginUrl = config.apis.govukOneLogin.homeUrl
      return res.render('pages/settings', { oneloginUrl, flags, queryParams })
    } catch (err) {
      return next(err)
    }
  }
}
