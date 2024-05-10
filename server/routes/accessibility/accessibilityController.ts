import { RequestHandler } from 'express'

export default class AccessibilityController {
  index: RequestHandler = async (req, res) => {
    const queryParams = req.query
    res.render('pages/accessibility', { queryParams })
  }
}
