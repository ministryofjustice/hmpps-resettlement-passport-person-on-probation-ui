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

  async changeItemCompleteFlag(
    nomsId: string,
    urn: string,
    itemId: string,
    completed: boolean,
    sessionId: string,
  ): Promise<TodoItem> {
    logger.debug(`SessionId: ${sessionId}. complete todoItem()`)
    return await this.restClient.patch<TodoItem>({
      path: `/person/${nomsId}/todo/${itemId}`,
      data: {
        urn,
        completed: completed,
      },
      headers: {
        SessionID: sessionId,
      },
    })
  }

  async getItem(nomsId: string, itemId: string, sessionID: string): Promise<TodoItem> {
    return await this.restClient.get<TodoItem>({
      path: `/person/${nomsId}/todo/${itemId}`,
      headers: {
        SessionID: sessionID,
      },
    })
  }

  async updateItem(nomsId: string, itemId: string, sessionID: string, request: TodoRequest): Promise<TodoItem> {
    logger.debug(`SessionId: ${sessionID}. update todoItem()`)
    return await this.restClient.put<TodoItem>({
      path: `/person/${nomsId}/todo/${itemId}`,
      data: request,
      headers: {
        SessionID: sessionID,
      },
    })
  }

  async deleteItem(nomsId: string, itemId: string, sessionID: string): Promise<void> {
    logger.debug(`SessionId: ${sessionID}. delete todoItem()`)
    return await this.restClient.delete({
      path: `/person/${nomsId}/todo/${itemId}`,
      headers: {
        SessionID: sessionID,
      },
    })
  }
}

export type TodoItem = {
  title: string
  notes?: string
  dueDate?: string
  completed: boolean
  updatedAt: string
}

export type TodoRequest = {
  urn: string
  title: string
  notes?: string
  dueDate?: string
}
