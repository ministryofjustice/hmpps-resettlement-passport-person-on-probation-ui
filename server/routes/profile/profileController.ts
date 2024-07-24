import { RequestHandler } from 'express'
import UserService from '../../services/userService'
import requireUser from '../requireUser'
import FeatureFlagsService from '../../services/featureFlagsService'

export default class ProfileController {
  constructor(
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

      const flags = await this.featureFlagsService.getFeatureFlags()

      const profile = await this.userService.getByNomsId(verificationData.nomsId, req.user?.sub, sessionId)
      const fullName = [
        profile.personalDetails.firstName,
        profile.personalDetails.middleNames,
        profile.personalDetails.lastName,
      ].join(' ')

      return res.render('pages/profile', {
        mobile: profile.personalDetails.mobile,
        email: profile.personalDetails.email,
        fullName,
        flags,
        queryParams,
      })
    } catch (err) {
      return next(err)
    }
  }
}
