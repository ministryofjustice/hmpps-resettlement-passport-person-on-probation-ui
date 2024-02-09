import { RequestHandler } from 'express'

import { pdfOptions } from '../../utils/pdfFormat'

import PDFDocument from 'pdfkit'
import fs from 'fs'

export default class HomeController {
  index: RequestHandler = async (req, res) => {
    res.render('pages/index')
  }
  pdf: RequestHandler = async (req, res) => {
    const filename = 'test1.pdf'
    res.renderPDF('pages/index', {}, { filename, pdfOptions: { ...pdfOptions } })
  }
  pdfkit: RequestHandler = async (req, res) => {
    const filename = 'test2.pdf'

    const doc = new PDFDocument({ size: "A4", margin: 50 })
    let buffers: any[] | Uint8Array[] = []
    doc.on('data', buffers.push.bind(buffers))
    doc.on('end', () => {
      let pdfData = Buffer.concat(buffers)
      res.header('Content-Type', 'application/pdf')
      res.header('Content-Transfer-Encoding', 'binary')
      res.header('Content-Disposition', `inline; filename=${filename}`)
      res.send(pdfData)
    })

    doc.image('assets/images/hmpps_logo_small.png', {
      fit: [50, 50],
      align: 'center',
      valign: 'center',
    })

    doc
    .fontSize(25)
    .text('Here is some text', 50, 120);

    // Add some text with annotations
    doc
      .addPage()
      .fillColor('blue')
      .text('Here is a link!', 50, 100)
      .underline(100, 100, 160, 27, { color: '#0000FF' })
      .link(100, 100, 160, 27, 'http://google.com/')

    // Finalize PDF file
    doc.end()
  }
}
