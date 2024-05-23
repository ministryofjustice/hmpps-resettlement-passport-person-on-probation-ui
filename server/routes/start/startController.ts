import { RequestHandler } from 'express'

export default class StartController {
  index: RequestHandler = async (req, res) => {
    const queryParams = req.query
    res.render('pages/start', queryParams)
  }
}
