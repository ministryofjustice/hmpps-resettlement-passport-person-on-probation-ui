import { ReadableStream } from 'node:stream/web'
import Agent, { HttpsAgent } from 'agentkeepalive'
import superagent from 'superagent'

import { minutesToMilliseconds } from 'date-fns'
import logger from '../../logger'
import sanitiseError from '../sanitisedError'
import type { ApiConfig } from '../config'
import type { UnsanitisedError } from '../sanitisedError'
import { restClientMetricsMiddleware } from './restClientMetricsMiddleware'
import getHmppsAuthToken from './hmppsAuthClient'
import { TokenStore, tokenStoreFactory } from './tokenStore/tokenStore'

interface Request {
  path: string
  query?: object | string
  headers?: Record<string, string>
  responseType?: string
  raw?: boolean
}

interface RequestWithBody extends Request {
  data?: Record<string, unknown>
  retry?: boolean
}

interface PostRequest {
  path?: string
  headers?: Record<string, string>
  responseType?: string
  data?: object | string[]
  raw?: boolean
  query?: string
}

interface StreamRequest {
  path?: string
  headers?: Record<string, string>
  errorLogger?: (e: UnsanitisedError) => void
}

export default class RestClient {
  agent: Agent

  tokenStore: TokenStore

  constructor(
    private readonly name: string,
    private readonly apiConfig: ApiConfig,
  ) {
    this.agent = apiConfig.url.startsWith('https') ? new HttpsAgent(apiConfig.agent) : new Agent(apiConfig.agent)
    this.tokenStore = tokenStoreFactory()
  }

  private apiUrl() {
    return this.apiConfig.url
  }

  private timeoutConfig() {
    return this.apiConfig.timeout
  }

  private async getCachedTokenOrRefresh(): Promise<string> {
    const key = `hmppsAuthToken`

    const cachedToken = await this.tokenStore.getToken(key)

    if (cachedToken) {
      logger.info('Auth token found in cache')
      return Promise.resolve(cachedToken)
    }

    const token = await getHmppsAuthToken()
    await this.tokenStore.setToken(key, token.access_token, token.expires_in)

    logger.info(`Auth token fetched from Api, expires in ${token.expires_in}`)
    return token.access_token
  }

  async get<Response = unknown>({
    path,
    query = {},
    headers = {},
    responseType = '',
    raw = false,
  }: Request): Promise<Response> {
    logger.info(`${this.name} GET: ${path}`)
    try {
      const token = await this.getCachedTokenOrRefresh()
      const result = await superagent
        .get(`${this.apiUrl()}${path}`)
        .query(query)
        .agent(this.agent)
        .use(restClientMetricsMiddleware)
        .retry(2, (err, _) => {
          if (err) logger.info(`Retry handler found ${this.name} API error with ${err.code} ${err.message}`)
          return undefined // retry handler only for logging retries, not to influence retry logic
        })
        .auth(token, { type: 'bearer' })
        .set(headers)
        .responseType(responseType)
        .timeout(this.timeoutConfig())

      return raw ? (result as Response) : result.body
    } catch (error) {
      const sanitisedError = sanitiseError(error)
      logger.warn({ ...sanitisedError }, `Error calling ${this.name}, path: '${path}', verb: 'GET'`)
      throw sanitisedError
    }
  }

  async externalPost<T>({
    path = null,
    query = '',
    headers = {},
    responseType = '',
    data = {},
    raw = false,
  }: PostRequest = {}): Promise<T> {
    const endpoint = `${this.apiUrl()}${path}`
    try {
      const result = await superagent
        .post(endpoint)
        .send(data)
        .agent(this.agent)
        .query(query)
        .use(restClientMetricsMiddleware)
        .retry(2, (err, _) => {
          if (err) logger.info(`Retry handler found API error with ${err.code} ${err.message}`)
          return undefined // retry handler only for logging retries, not to influence retry logic
        })
        .set(headers)
        .responseType(responseType)
        .timeout(this.timeoutConfig())

      return raw ? (result as T) : result.body
    } catch (error) {
      const sanitisedError = sanitiseError(error)
      logger.warn({ ...sanitisedError }, `Error calling ${this.name}, path: '${path}', verb: 'DELETE'`)
      throw sanitisedError
    }
  }

  async post<T>({
    path = null,
    query = '',
    headers = {},
    responseType = '',
    data = {},
    raw = false,
  }: PostRequest = {}): Promise<T> {
    logger.info(`Post using user credentials: calling ${this.name}: ${path}`)
    const endpoint = `${this.apiUrl()}${path}`
    try {
      const token = await this.getCachedTokenOrRefresh()
      const result = await superagent
        .post(endpoint)
        .send(data)
        .agent(this.agent)
        .query(query)
        .use(restClientMetricsMiddleware)
        .retry(2, (err, _) => {
          if (err) logger.info(`Retry handler found API error with ${err.code} ${err.message}`)
          return undefined // retry handler only for logging retries, not to influence retry logic
        })
        .auth(token, { type: 'bearer' })
        .set(headers)
        .responseType(responseType)
        .timeout(this.timeoutConfig())

      return raw ? (result as T) : result.body
    } catch (error) {
      const sanitisedError = sanitiseError(error)
      logger.warn({ ...sanitisedError }, `Error calling ${this.name}, path: '${path}', verb: 'DELETE'`)
      throw sanitisedError
    }
  }

  private async requestWithBody<Response = unknown>(
    method: 'patch' | 'post' | 'put',
    { path, query = {}, headers = {}, responseType = '', data = {}, raw = false, retry = false }: RequestWithBody,
  ): Promise<Response> {
    logger.info(`${this.name} ${method.toUpperCase()}: ${path}`)
    try {
      const token = await this.getCachedTokenOrRefresh()
      const result = await superagent[method](`${this.apiUrl()}${path}`)
        .query(query)
        .send(data)
        .agent(this.agent)
        .use(restClientMetricsMiddleware)
        .retry(2, (err, _) => {
          if (retry === false) {
            return false
          }
          if (err) logger.info(`Retry handler found API error with ${err.code} ${err.message}`)
          return undefined // retry handler only for logging retries, not to influence retry logic
        })
        .auth(token, { type: 'bearer' })
        .set(headers)
        .responseType(responseType)
        .timeout(this.timeoutConfig())

      return raw ? (result as Response) : result.body
    } catch (error) {
      const sanitisedError = sanitiseError(error)
      logger.warn({ ...sanitisedError }, `Error calling ${this.name}, path: '${path}', verb: '${method.toUpperCase()}'`)
      throw sanitisedError
    }
  }

  async patch<Response = unknown>(request: RequestWithBody): Promise<Response> {
    return this.requestWithBody('patch', request)
  }

  async put<Response = unknown>(request: RequestWithBody): Promise<Response> {
    return this.requestWithBody('put', request)
  }

  async delete<Response = unknown>({
    path,
    query = {},
    headers = {},
    responseType = '',
    raw = false,
  }: Request): Promise<Response> {
    logger.info(`${this.name} DELETE: ${path}`)
    try {
      const token = await this.getCachedTokenOrRefresh()
      const result = await superagent
        .delete(`${this.apiUrl()}${path}`)
        .query(query)
        .agent(this.agent)
        .use(restClientMetricsMiddleware)
        .retry(2, (err, _) => {
          if (err) logger.info(`Retry handler found ${this.name} API error with ${err.code} ${err.message}`)
          return undefined // retry handler only for logging retries, not to influence retry logic
        })
        .auth(token, { type: 'bearer' })
        .set(headers)
        .responseType(responseType)
        .timeout(this.timeoutConfig())

      return raw ? (result as Response) : result.body
    } catch (error) {
      const sanitisedError = sanitiseError(error)
      logger.warn({ ...sanitisedError }, `Error calling ${this.name}, path: '${path}', verb: 'DELETE'`)
      throw sanitisedError
    }
  }

  async download({ path = null, headers = {} }: StreamRequest = {}): Promise<ReadableStream<Uint8Array>> {
    const token = await this.getCachedTokenOrRefresh()
    const response = await fetch(`${this.apiUrl()}${path}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        ...headers,
      },
      keepalive: true,
      signal: AbortSignal.timeout(minutesToMilliseconds(5)),
    })

    if (response.ok) {
      return response.body
    }
    throw new Error(`Request failed with ${response.status} ${response.statusText}`)
  }
}
