import { RequestHandler } from 'express'

export default class HomeController {
  index: RequestHandler = async (req, res) => {
    /**
     * To be deleted, this code is to test the Redis session is configured correctly
     */
    if (!req.session.tempValue) {
      req.session.tempValue = Math.random()
    }

    res.render('pages/index', {
      sessionValue: req.session.tempValue,
    })
  }
}
