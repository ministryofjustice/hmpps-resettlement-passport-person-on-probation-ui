import { RequestHandler } from 'express'
import sanitizeHtml from 'sanitize-html'
import ZendeskService from '../../services/zendeskService'
import { ContactHelpdeskForm } from '../../data/zendeskData'
import logger from '../../../logger'
import { isValidEmail } from '../../utils/utils'

export default class FeedbackController {
  constructor(private readonly zendeskService: ZendeskService) {}

  index: RequestHandler = async (req, res, next) => {
    try {
      const queryParams = req.query
      // clear session
      req.session.feedback = null
      return res.render('pages/feedback', { user: req.user, queryParams })
    } catch (err) {
      return next(err)
    }
  }

  questions: RequestHandler = async (req, res, next) => {
    try {
      const queryParams = req.query
      if (req.session.feedback) {
        // prepopulate
        return res.render('pages/feedback-questions', { user: req.user, feedback: req.session.feedback, queryParams })
      }
      return res.render('pages/feedback-questions', { user: req.user })
    } catch (err) {
      return next(err)
    }
  }

  submitQuestions: RequestHandler = async (req, res, next) => {
    const { score, details, name, email } = req.body
    try {
      const errors: Array<Express.ValidationError> = []
      if (!score) {
        errors.push({
          text: req.t('feedback-error-satisfaction'),
          href: '#score',
        })
      }
      if (email.length > 0 && !isValidEmail(email)) {
        errors.push({
          text: req.t('feedback-error-email'),
          href: '#email',
        })
      }

      req.session.feedback = {
        score,
        details: sanitizeHtml(details),
        name: sanitizeHtml(name),
        email,
      }

      if (errors.length > 0) {
        const scoreError = errors.find(x => x.href === '#score')
        const emailError = errors.find(x => x.href === '#email')
        return res.render('pages/feedback-questions', {
          user: req.user,
          errors,
          scoreError,
          emailError,
          feedback: req.session.feedback,
        })
      }
      return res.redirect('/feedback/review')
    } catch (err) {
      return next(err)
    }
  }

  review: RequestHandler = async (req, res, next) => {
    try {
      const queryParams = req.query
      if (req.session.feedback) {
        // prepopulate
        return res.render('pages/feedback-review', { user: req.user, feedback: req.session.feedback })
      }
      return res.render('pages/feedback-review', { user: req.user, queryParams })
    } catch (err) {
      return next(err)
    }
  }

  submitReview: RequestHandler = async (req, res, next) => {
    try {
      if (!req.session.feedback) {
        next(new Error('Missing feedback session data'))
      }
      const queryParams = req.query
      const { feedback } = req.session
      const form: ContactHelpdeskForm = { ...feedback }
      const ticketId = await this.zendeskService.createSupportTicket(form)
      logger.info(`Submitted ZenDesk ticket: ${ticketId}`)
      // clear session
      req.session.feedback = null
      return res.render('pages/feedback-end', { user: req.user, queryParams })
    } catch (err) {
      return next(err)
    }
  }
}
