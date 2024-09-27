import RestClient from '../data/restClient'
import config from '../config'
import logger from '../../logger'

export default class TodoService {
  restClient: RestClient

  constructor() {
    this.restClient = new RestClient('Resettlement Passport Api Client', config.apis.resettlementPassportApi)
  }

  async createItem(nomsId: string, sessionId: string, request: TodoRequest): Promise<TodoItem> {
    logger.debug(`SessionId: ${sessionId}. create todoItem()`)
    return await this.restClient.post<TodoItem>({
      path: `/person/${nomsId}/todo`,
      data: request,
      headers: {
        SessionID: sessionId,
      },
    })
  }

  async getList(nomsId: string, sessionId: string): Promise<TodoItem[]> {
    return await this.restClient.get<TodoItem[]>({
      path: `/person/${nomsId}/todo`,
      headers: {
        SessionID: sessionId,
      },
    })
  }

  async completeItem(nomsId: string, urn: string, itemId: string, sessionId: string): Promise<TodoItem> {
    logger.debug(`SessionId: ${sessionId}. complete todoItem()`)
    return await this.restClient.patch<TodoItem>({
      path: `/person/${nomsId}/todo/${itemId}`,
      data: {
        urn,
        completed: true,
      },
      headers: {
        SessionID: sessionId,
      },
    })
  }
}

export type TodoItem = {
  title: string
  notes?: string
  dueDate?: string
  completed: boolean
}

export type TodoRequest = {
  urn: string
  title: string
  notes?: string
  dueDate?: string
}
