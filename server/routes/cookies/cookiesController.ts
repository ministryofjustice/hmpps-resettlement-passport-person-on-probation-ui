import { RequestHandler } from 'express'

export default class CookiesController {
  index: RequestHandler = async (req, res) => {
    res.render('pages/cookies')
  }
}
