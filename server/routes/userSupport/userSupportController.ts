import { RequestHandler } from 'express'
import ZendeskService from '../../services/zendeskService'
import { ContactHelpdeskForm } from '../../data/zendeskData'
import logger from '../../../logger'

export default class UserSupportController {
  constructor(private readonly zendeskService: ZendeskService) {}

  index: RequestHandler = async (req, res, next) => {
    try {
      return res.render('pages/userSupport', { user: req.user })
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
      return res.render('pages/userSupportComplete', { user: req.user })
    } catch (err) {
      return next(err)
    }
  }
}
