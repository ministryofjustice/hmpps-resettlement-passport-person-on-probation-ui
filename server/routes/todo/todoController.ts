import { Request, RequestHandler, Response } from 'express'
import TodoService from '../../services/todoService'
import UserService from '../../services/userService'
import requireUser from '../requireUser'
import { dateFromStrings, getDateFromDayMonthYear } from '../../utils/utils'
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

    const allItems = await this.todoService.getList(verificationData.crn, req.sessionID)
    const todoList = allItems.filter(item => !item.completed)
    const completedList = allItems.filter(item => item.completed)
    return res.render('pages/todo-list', { queryParams: req.query, todoList, completedList })
  }

  viewAddPage: RequestHandler = async (req, res, _) => {
    const verificationData = await this.requireUserAndFlag(req, res)
    if (!verificationData) return
    return res.render('pages/todo-add-edit')
  }

  viewEditPage: RequestHandler = async (req, res, _) => {
    const verificationData = await this.requireUserAndFlag(req, res)
    if (!verificationData) return

    const { itemId } = req.params
    if (!itemId) {
      return res.status(400).send()
    }

    const editItem = await this.todoService.getItem(verificationData.crn, itemId, req.sessionID)

    return res.render('pages/todo-add-edit', { edit: true, editItem })
  }

  postItem: RequestHandler = async (req, res, _) => {
    const verificationData = await this.requireUserAndFlag(req, res)
    if (!verificationData) return

    const validationResult = validateSubmission(req)
    if (validationResult.errors.length > 0) {
      return res.render('pages/todo-add-edit', { editItem: req.body, validationResult })
    }

    const submission: TodoFormBody = req.body
    await this.todoService.createItem(verificationData.crn, req.sessionID, {
      urn: verificationData.oneLoginUrn,
      title: submission.title,
      notes: submission.notes,
      dueDate: dateFromStrings(submission['date-day'], submission['date-month'], submission['date-year']),
    })
    return res.redirect('/todo')
  }

  postEdit: RequestHandler = async (req, res, _) => {
    const verificationData = await this.requireUserAndFlag(req, res)
    if (!verificationData) return

    const { itemId } = req.params
    if (!itemId) {
      return res.status(400).send()
    }
    const validationResult = validateSubmission(req)
    if (validationResult.errors.length > 0) {
      return res.render('pages/todo-add-edit', { edit: true, editItem: req.body, validationResult })
    }

    const submission: TodoFormBody = req.body
    await this.todoService.updateItem(verificationData.crn, itemId, req.sessionID, {
      urn: verificationData.oneLoginUrn,
      title: submission.title,
      notes: submission.notes,
      dueDate: dateFromStrings(submission['date-day'], submission['date-month'], submission['date-year']),
    })
    return res.redirect('/todo')
  }

  completeItem: RequestHandler = async (req, res, _) => {
    const verificationData = await this.requireUserAndFlag(req, res)
    if (!verificationData) return

    const { itemId } = req.params
    if (!itemId) {
      return res.status(400).send()
    }

    await this.todoService.completeItem(verificationData.crn, verificationData.oneLoginUrn, itemId, req.sessionID)

    return res.status(200).send()
  }

  deleteItem: RequestHandler = async (req, res, _) => {
    const verificationData = await this.requireUserAndFlag(req, res)
    if (!verificationData) return

    const { itemId } = req.params
    if (!itemId) {
      return res.status(400).send()
    }

    await this.todoService.deleteItem(verificationData.crn, itemId, req.sessionID)

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
    const dueDate = getDateFromDayMonthYear(body['date-day'], body['date-month'], body['date-year'])
    if (!dueDate) {
      const message = req.t('todo-error-invalid-date')
      errors.push({
        text: message,
        href: '#due-date',
      })
      result.dueDate = message
    } else if (isBefore(dueDate, startOfToday())) {
      const message = req.t('todo-error-past-date')
      errors.push({
        text: message,
        href: '#due-date',
      })
      result.dueDate = message
    }
  }

  return result
}
