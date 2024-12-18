import { Request, RequestHandler, Response } from 'express'
import TodoService from '../../services/todoService'
import UserService from '../../services/userService'
import requireUser from '../requireUser'
import { dateFromStrings, getDateFromDayMonthYear, isNotEmpty, isValidYear } from '../../utils/utils'
import FeatureFlagsService from '../../services/featureFlagsService'
import { FeatureFlagKey } from '../../services/featureFlags'
import { UserDetailsResponse } from '../../data/personOnProbationApiClient'
import { isBefore, startOfToday } from 'date-fns'

export default class TodoController {
  constructor(
    private readonly todoService: TodoService,
    private readonly userService: UserService,
    private readonly featureFlagsService: FeatureFlagsService,
  ) {}

  viewList: RequestHandler = async (req, res, _) => {
    const verificationData = await this.requireUserAndFlag(req, res)
    if (!verificationData) return

    const allItems = await this.todoService.getList(verificationData.nomsId, req.sessionID)
    const todoList = allItems.filter(item => !item.completed)
    const completedList = allItems.filter(item => item.completed)
    return res.render('pages/todo-list', { queryParams: req.query, todoList, completedList })
  }

  viewAddPage: RequestHandler = async (req, res, _) => {
    const verificationData = await this.requireUserAndFlag(req, res)
    if (!verificationData) return
    return res.render('pages/todo-add-edit')
  }

  viewEditPage: RequestHandler = async (req, res, _): Promise<void> => {
    const verificationData = await this.requireUserAndFlag(req, res)
    if (!verificationData) return

    const { itemId } = req.params
    if (!itemId) {
      res.status(400).send()
      return
    }

    const editItem = await this.todoService.getItem(verificationData.nomsId, itemId, req.sessionID)

    return res.render('pages/todo-add-edit', { itemId, edit: true, editItem })
  }

  postItem: RequestHandler = async (req, res, _) => {
    const verificationData = await this.requireUserAndFlag(req, res)
    if (!verificationData) return

    const validationResult = validateSubmission(req)
    if (validationResult.errors.length > 0) {
      return res.render('pages/todo-add-edit', { editItem: req.body, validationResult })
    }

    const submission: TodoFormBody = req.body
    await this.todoService.createItem(verificationData.nomsId, req.sessionID, {
      urn: verificationData.oneLoginUrn,
      title: submission.title,
      notes: submission.notes,
      dueDate: dateFromStrings(submission['date-day'], submission['date-month'], submission['date-year']),
    })
    return res.redirect('/todo')
  }

  postEdit: RequestHandler = async (req, res, _): Promise<void> => {
    const verificationData = await this.requireUserAndFlag(req, res)
    if (!verificationData) return

    const { itemId } = req.params
    if (!itemId) {
      res.status(400).send()
      return
    }
    const validationResult = validateSubmission(req)
    if (validationResult.errors.length > 0) {
      return res.render('pages/todo-add-edit', { itemId, edit: true, editItem: req.body, validationResult })
    }

    const submission: TodoFormBody = req.body
    await this.todoService.updateItem(verificationData.nomsId, itemId, req.sessionID, {
      urn: verificationData.oneLoginUrn,
      title: submission.title,
      notes: submission.notes,
      dueDate: dateFromStrings(submission['date-day'], submission['date-month'], submission['date-year']),
    })
    return res.redirect('/todo')
  }

  itemCompleted: RequestHandler = async (req, res, _): Promise<void> => {
    return this.changeStatus(req, res, true)
  }

  private async changeStatus(req: Request, res: Response, status: boolean): Promise<void> {
    const ajaxMode = req.headers['ajax-mode'] === 'true'
    const verificationData = await this.requireUserAndFlag(req, res)
    if (!verificationData) return

    const { itemId } = req.params
    if (!itemId) {
      res.status(400).send()
      return
    }

    await this.todoService.changeItemCompleteFlag(
      verificationData.nomsId,
      verificationData.oneLoginUrn,
      itemId,
      status,
      req.sessionID,
    )

    if (!ajaxMode) {
      // if javascript is disabled in frontend, redirect back to the to-do page to keep the url sane
      return res.redirect('/todo')
    }
    const allItems = await this.todoService.getList(verificationData.nomsId, req.sessionID)
    const todoList = allItems.filter(item => !item.completed)
    const completedList = allItems.filter(item => item.completed)
    return res.render('pages/todo-list', { queryParams: req.query, todoList, completedList })
  }

  itemNotCompeted: RequestHandler = async (req, res, _): Promise<void> => {
    return this.changeStatus(req, res, false)
  }

  deleteItem: RequestHandler = async (req, res, _): Promise<void> => {
    const verificationData = await this.requireUserAndFlag(req, res)
    if (!verificationData) return

    const { itemId } = req.params
    if (!itemId) {
      res.status(400).send()
      return
    }

    await this.todoService.deleteItem(verificationData.nomsId, itemId, req.sessionID)

    return res.redirect('/todo')
  }

  private async requireUserAndFlag(req: Request, res: Response): Promise<UserDetailsResponse> {
    const flags = await this.featureFlagsService.getFeatureFlags(res)
    if (!flags.isEnabled(FeatureFlagKey.TODO_LIST)) {
      res.redirect('/overview')
      return null
    }
    const verificationData = await requireUser(req.user?.sub, this.userService, req.sessionID)
    if (typeof verificationData === 'string') {
      res.redirect(verificationData)
      return null
    }
    return verificationData
  }
}

export type TodoFormBody = {
  title?: string
  notes?: string
  'date-day'?: string
  'date-month'?: string
  'date-year'?: string
}

type ValidationResult = {
  errors: Express.ValidationError[]
  title?: string
  dueDate?: string
  missingDateField?: string[]
}

export function validateSubmission(req: Express.Request): ValidationResult {
  const errors: Express.ValidationError[] = []
  const body: TodoFormBody = req.body
  const result: ValidationResult = {
    errors,
  }

  if (!body.title) {
    const message = req.t('todo-error-title')
    errors.push({
      text: message,
      href: '#title',
    })
    result.title = message
  }

  // Only validate if has been set
  if (body['date-day'] || body['date-month'] || body['date-year']) {
    if (!body['date-day'] && !body['date-month'] && !body['date-year']) {
      const message = req.t('todo-error-invalid-date')
      errors.push({
        text: message,
        href: '#due-date',
      })
      result.dueDate = message
      result.missingDateField = ['day', 'month', 'year']
    } else if (!isNotEmpty(body['date-day']) && isNotEmpty(body['date-year']) && !isNotEmpty(body['date-month'])) {
      const message = req.t('todo-error-invalid-day-month')
      errors.push({
        text: message,
        href: '#due-date',
      })
      result.dueDate = message
      result.missingDateField = ['day', 'month']
    } else if (!isNotEmpty(body['date-day']) && isNotEmpty(body['date-month']) && !isNotEmpty(body['date-year'])) {
      const message = req.t('todo-error-invalid-day-year')
      errors.push({
        text: message,
        href: '#due-date',
      })
      result.dueDate = message
      result.missingDateField = ['day', 'year']
    } else if (!isNotEmpty(body['date-month']) && isNotEmpty(body['date-day']) && !isNotEmpty(body['date-year'])) {
      const message = req.t('todo-error-invalid-month-year')
      errors.push({
        text: message,
        href: '#due-date',
      })
      result.dueDate = message
      result.missingDateField = ['month', 'year']
    } else if (isNotEmpty(body['date-month']) && isNotEmpty(body['date-year']) && !isNotEmpty(body['date-day'])) {
      const message = req.t('todo-error-invalid-day')
      errors.push({
        text: message,
        href: '#due-date',
      })
      result.dueDate = message
      result.missingDateField = ['day']
    } else if (isNotEmpty(body['date-day']) && isNotEmpty(body['date-year']) && !isNotEmpty(body['date-month'])) {
      const message = req.t('todo-error-invalid-month')
      errors.push({
        text: message,
        href: '#due-date',
      })
      result.dueDate = message
      result.missingDateField = ['month']
    } else if (isNotEmpty(body['date-day']) && isNotEmpty(body['date-month']) && !isNotEmpty(body['date-year'])) {
      const message = req.t('todo-error-invalid-year')
      errors.push({
        text: message,
        href: '#due-date',
      })
      result.dueDate = message
      result.missingDateField = ['year']
    } else if (
      isNotEmpty(body['date-day']) &&
      isNotEmpty(body['date-month']) &&
      isNotEmpty(body['date-year']) &&
      !isValidYear(body['date-year'])
    ) {
      const message = req.t('todo-error-invalid-year')
      errors.push({
        text: message,
        href: '#due-date',
      })
      result.dueDate = message
      result.missingDateField = ['year']
    } else {
      const dueDate = getDateFromDayMonthYear(body['date-day'], body['date-month'], body['date-year'])
      if (!dueDate) {
        const message = req.t('todo-error-invalid-date')
        errors.push({
          text: message,
          href: '#due-date',
        })
        result.dueDate = message
        result.missingDateField = ['day', 'month', 'year']
      } else if (isBefore(dueDate, startOfToday())) {
        const message = req.t('todo-error-past-date')
        errors.push({
          text: message,
          href: '#due-date',
        })
        result.dueDate = message
        result.missingDateField = ['day', 'month', 'year']
      }
    }
  }

  return result
}
