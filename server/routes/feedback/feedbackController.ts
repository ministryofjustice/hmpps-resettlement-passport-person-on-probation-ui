import { RequestHandler } from 'express'
import ZendeskService from '../../services/zendeskService'
import { ContactHelpdeskForm } from '../../data/zendeskData'
import logger from '../../../logger'

export default class FeedbackController {
  constructor(private readonly zendeskService: ZendeskService) {}

  index: RequestHandler = async (req, res, next) => {
    try {
      return res.render('pages/feedback', { user: req.user })
    } catch (err) {
      return next(err)
    }
  }

  questions: RequestHandler = async (req, res, next) => {
    try {
      return res.render('pages/feedback-questions', { user: req.user })
    } catch (err) {
      return next(err)
    }
  }

  review: RequestHandler = async (req, res, next) => {
    try {
      return res.render('pages/feedback-review', { user: req.user })
    } catch (err) {
      return next(err)
    }
  }

  create: RequestHandler = async (req, res, next) => {
    try {
      const form: ContactHelpdeskForm = {
        score: 6,
        detail: 'I cannot remember my password',
        name: 'Riccardo',
        email: 'test@hippodigital.co.uk',
      }
      const ticketId = await this.zendeskService.createSupportTicket(form)
      logger.info(`Submitted ZenDesk ticket: ${ticketId}`)
      return res.render('pages/feedback-end', { user: req.user })
    } catch (err) {
      return next(err)
    }
  }
}
