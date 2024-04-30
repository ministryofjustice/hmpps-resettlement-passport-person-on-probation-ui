import { rateLimiterMiddleware } from './rateLimiter'
import { Request, Response, NextFunction } from 'express'
import { createRequest, createResponse, MockRequest, MockResponse } from 'node-mocks-http'

jest.mock('express')

describe('rateLimiterMiddleware', () => {
  let reqMock: MockRequest<Request>
  let resMock: MockResponse<Response>
  let nextMock: jest.Mocked<NextFunction>

  beforeAll(() => {
    jest.useFakeTimers({ advanceTimers: true })
    jest.setSystemTime(new Date(2023, 8, 2))
  })

  beforeEach(() => {
    resMock = createResponse()
    nextMock = jest.fn()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  it('should allow some paths', () => {
    reqMock = createRequest({
      method: 'GET',
      url: '/',
    })
    rateLimiterMiddleware(reqMock, resMock, nextMock)
    expect(nextMock).toHaveBeenCalled()
  })

  it('should restrict some paths', () => {
    reqMock = createRequest({
      method: 'POST',
      url: '/otp/verify',
    })
    rateLimiterMiddleware(reqMock, resMock, nextMock)
    expect(resMock.status).toBe(429)
    expect(nextMock).not.toHaveBeenCalled()
  })

  it('should limit more than 10 requests in 1 minute', () => {})

  it('should allow more than 10 requests in 1 minute after latest reset', () => {})
})
