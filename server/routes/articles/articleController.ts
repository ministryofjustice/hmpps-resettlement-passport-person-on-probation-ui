import { RequestHandler } from 'express'

export default class ArticleController {
  index: RequestHandler = async (req, res) => {
    const queryParams = req.query
    res.render('pages/article', { queryParams })
  }
}
