import { RequestHandler } from 'express'
import UserService from '../../services/userService'

export default class DashboardController {
  constructor(private readonly userService: UserService) {}

  index: RequestHandler = async (req, res) => {
    // const testSub = 'fdc:gov.uk:2022:T5fYp6sYl3DdYNF0tDfZtF-c4ZKewWRLw8YGcy6oEj8'
    const isVerified = await this.userService.isVerified(req.user.sub)
    if (!isVerified) {
      return res.redirect('/otp')
    }
    return res.render('pages/dashboard', { user: req.user })
  }
}
