import { RequestHandler } from 'express'

export default class HomeController {
  index: RequestHandler = async (req, res) => {
    res.render('pages/otp')
  }
}
