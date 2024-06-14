import { RequestHandler } from 'express'
import { handleContent } from '../../middleware/contentful'

export default class ArticleController {
  index: RequestHandler = async (req, res) => {
    const queryParams = req.query
    const pageId = req.params.id

    const content = await handleContent()
    const page = content?.find(x => x.slug === pageId)
    const navList = content
      ?.map(x => ({
        slug: x.slug,
        title: x.title,
        order: x.order,
      }))
      .sort((a, b) => a.order - b.order);

    res.render('pages/article', { page, pageId, navList, queryParams, numPages: content?.length || 0  })
  }
}
