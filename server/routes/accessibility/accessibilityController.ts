import { RequestHandler } from 'express'

export default class AccessibilityController {
  index: RequestHandler = async (req, res) => {
    res.render('pages/accessibility')
  }
}
