import RestClient from '../data/restClient'
import config from '../config'
import logger from '../../logger'

export default class TodoService {
  restClient: RestClient

  constructor() {
    this.restClient = new RestClient('Resettlement Passport Api Client', config.apis.resettlementPassportApi)
  }

  async createItem(crn: string, sessionId: string, request: TodoRequest): Promise<TodoItem> {
    logger.debug(`SessionId: ${sessionId}. create todoItem()`)
    return await this.restClient.post<TodoItem>({
      path: `/person/${crn}/todo`,
      data: request,
      headers: {
        SessionID: sessionId,
      },
    })
  }

  async getList(crn: string, sessionId: string): Promise<TodoItem[]> {
    return await this.restClient.get<TodoItem[]>({
      path: `/person/${crn}/todo`,
      headers: {
        SessionID: sessionId,
      },
    })
  }

  async completeItem(crn: string, urn: string, itemId: string, sessionId: string): Promise<TodoItem> {
    logger.debug(`SessionId: ${sessionId}. complete todoItem()`)
    return await this.restClient.patch<TodoItem>({
      path: `/person/${crn}/todo/${itemId}`,
      data: {
        urn,
        completed: true,
      },
      headers: {
        SessionID: sessionId,
      },
    })
  }

  async getItem(crn: string, itemId: string, sessionID: string) {
    return await this.restClient.get<TodoItem>({
      path: `/person/${crn}/todo/${itemId}`,
      headers: {
        SessionID: sessionID,
      },
    })
  }

  async updateItem(crn: string, itemId: string, sessionID: string, request: TodoRequest) {
    logger.debug(`SessionId: ${sessionID}. update todoItem()`)
    return await this.restClient.put<TodoItem>({
      path: `/person/${crn}/todo/${itemId}`,
      data: request,
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