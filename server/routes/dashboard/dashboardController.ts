import { RequestHandler } from 'express'
import UserService from '../../services/userService'

export default class DashboardController {
  constructor(private readonly userService: UserService) {}

  index: RequestHandler = async (req, res) => {
    // const testSub = 'fdc:gov.uk:2022:T5fYp6sYl3DdYNF0tDfZtF-c4ZKewWRLw8YGcy6oEj8'
    const verificationData = await this.userService.isVerified(req.user.sub)
    if (!verificationData?.verified === true) {
      return res.redirect('/otp')
    }
    const personalData = await this.userService.getByNomsId(verificationData.nomsId)
    return res.render('pages/dashboard', { user: req.user, personalData })
  }
}
