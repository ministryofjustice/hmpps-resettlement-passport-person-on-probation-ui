import { RequestHandler, Request, Response } from 'express'
import { fetchContent } from '../../services/contentfulService'

export default class PagesController {
  private async renderPage(req: Request, res: Response, pageId: string) {
    const queryParams = req.query
    const lang = req.query.lang || 'en'
    const content = await fetchContent(lang?.toString())

    const page = content?.find(x => x.slug === pageId)
    const navList = content
      ?.map(x => ({
        slug: x.slug,
        title: x.title,
        order: x.order,
      }))
      .sort((a, b) => a.order - b.order)

    res.render('pages/page', { page, pageId, navList, queryParams, numPages: content?.length || 0 })
  }

  start: RequestHandler = async (req, res) => {
    const startPageId = 'plan-your-future'
    await this.renderPage(req, res, startPageId)
  }

  index: RequestHandler = async (req, res) => {
    const pageId = req.params.id
    await this.renderPage(req, res, pageId)
  }
}
