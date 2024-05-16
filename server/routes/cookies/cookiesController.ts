import { RequestHandler } from 'express'
import { fetchPage } from '../../middleware/contentful'

function getLocale(lang: string): string {
  if (lang === 'cy') {
    return 'cy'
  }
  return 'en-GB'
}

export default class CookiesController {
  index: RequestHandler = async (req, res) => {
    const queryParams = req.query
    console.log('Fetching cookie page from contentful')
    const locale = getLocale(queryParams?.lang?.toString())
    const html = await fetchPage(locale, 'cookie-page')
    res.render('pages/cookies', { queryParams, html })
  }
}
