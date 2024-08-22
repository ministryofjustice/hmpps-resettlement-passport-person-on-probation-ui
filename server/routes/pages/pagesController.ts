import { RequestHandler, Request, Response } from 'express'
import { fetchNavigation, fetchPageBySlug } from '../../services/contentfulService'
import logger from '../../../logger'

export default class PagesController {
  private async renderNavigationItems(req: Request, res: Response, pageId: string) {
    const queryParams = req.query
    const lang = req.query.lang || 'en'
    const content = await fetchNavigation(lang?.toString())

    const page = content?.find(x => x.slug === pageId)
    const navList = content
      ?.map(x => ({
        slug: x.slug,
        title: x.title,
        order: x.order,
      }))
      .sort((a, b) => a.order - b.order)

    return res.render('pages/contentfulStartPages', {
      page,
      pageId,
      navList,
      queryParams,
      numPages: content?.length || 0,
    })
  }

  private async renderSinglePage(req: Request, res: Response, slug: string, template: string) {
    const queryParams = req.query
    const lang = req.query.lang || 'en'
    const page = await fetchPageBySlug(slug, lang?.toString())
    if (!page) {
      logger.error(`Contentful page with slug: '${slug}' not found. Fix content at source.`)
      return res.status(404).render('pages/notFound')
    }

    return res.render(template, { page, queryParams })
  }

  start: RequestHandler = async (req, res) => {
    const startPageId = 'plan-your-future'
    await this.renderNavigationItems(req, res, startPageId)
  }

  index: RequestHandler = async (req, res) => {
    const pageId = req.params.id
    await this.renderNavigationItems(req, res, pageId)
  }

  accessibility: RequestHandler = async (req, res) => {
    await this.renderSinglePage(req, res, 'accessibility', 'pages/contentfulPage')
  }

  cookies: RequestHandler = async (req, res) => {
    await this.renderSinglePage(req, res, 'cookies', 'pages/contentfulPage')
  }

  privacy: RequestHandler = async (req, res) => {
    await this.renderSinglePage(req, res, 'privacy-notice', 'pages/contentfulPage')
  }
}
