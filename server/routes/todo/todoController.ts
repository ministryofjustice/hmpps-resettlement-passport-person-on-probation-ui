import { RequestHandler } from 'express'
import TodoService from '../../services/todoService'
import UserService from '../../services/userService'
import requireUser from '../requireUser'
import { getDobDateString } from '../../utils/utils'

export default class TodoController {
  constructor(
    private readonly todoService: TodoService,
    private readonly userService: UserService,
  ) {}

  viewList: RequestHandler = async (req, res, _) => {
    const verificationData = await requireUser(req.user?.sub, this.userService, req.sessionID)
    if (typeof verificationData === 'string') {
      return res.redirect(verificationData)
    }
    const todoList = await this.todoService.getList(verificationData.nomsId, req.sessionID)
    return res.render('pages/todo-list', { queryParams: req.query, todoList })
  }

  viewAddPage: RequestHandler = async (req, res, _) => {
    const verificationData = await requireUser(req.user?.sub, this.userService, req.sessionID)
    if (typeof verificationData === 'string') {
      return res.redirect(verificationData)
    }
    return res.render('pages/todo-add')
  }

  postItem: RequestHandler = async (req, res, _) => {
    const verificationData = await requireUser(req.user?.sub, this.userService, req.sessionID)
    if (typeof verificationData === 'string') {
      return res.redirect(verificationData)
    }
    // TODO: Validate
    const submission: FormBody = req.body
    await this.todoService.createItem(verificationData.nomsId, req.sessionID, {
      urn: verificationData.oneLoginUrn,
      title: submission.title,
      notes: submission.notes,
      dueDate: getDobDateString(submission['date-day'], submission['date-month'], submission['date-year']),
    })
    return res.redirect('/todo')
  }

  completeItem: RequestHandler = async (req, res, _) => {
    const verificationData = await requireUser(req.user?.sub, this.userService, req.sessionID)
    if (typeof verificationData === 'string') {
      return res.redirect(verificationData)
    }
    const { itemId } = req.params
    if (!itemId) {
      return res.status(400).send()
    }

    await this.todoService.completeItem(verificationData.nomsId, verificationData.oneLoginUrn, itemId, req.sessionID)

    return res.status(200).send()
  }
}

type FormBody = {
  title: string
  notes?: string
  'date-day'?: string
  'date-month'?: string
  'date-year'?: string
}
