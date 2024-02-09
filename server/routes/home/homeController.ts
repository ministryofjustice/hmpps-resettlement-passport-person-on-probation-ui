import { RequestHandler } from 'express'

import { pdfOptions } from '../../utils/pdfFormat'

export default class HomeController {
  index: RequestHandler = async (req, res) => {
    res.render('pages/index')
  }
  pdf: RequestHandler = async (req, res) => {
    const filename = 'test.pdf'
    res.renderPDF('pages/index', {},
    { filename, pdfOptions: { ...pdfOptions } })
  }
}
