import { RequestHandler } from 'express'

export default class HomeController {
  index: RequestHandler = async (req, res) => {
    const queryParams = req.query
    res.render('pages/index', queryParams)
  }
}
