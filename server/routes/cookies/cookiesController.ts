import { RequestHandler } from 'express'

export default class CookiesController {
  index: RequestHandler = async (req, res) => {
    const queryParams = req.query
    res.render('pages/cookies', { queryParams })
  }
}
