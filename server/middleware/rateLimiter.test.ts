import { addSeconds } from 'date-fns'
import { Request, Response, NextFunction } from 'express'
import { createRequest, createResponse, MockRequest, MockResponse } from 'node-mocks-http'
import { rateLimiterMiddleware } from './rateLimiter'

jest.mock('express')

describe('rateLimiterMiddleware', () => {
  let reqMock: MockRequest<Request>
  let resMock: MockResponse<Response>
  let nextMock: jest.Mocked<NextFunction>

  const fakeDate = new Date('2024-01-01T10:00:00Z')
  const realDate = Date.now

  beforeEach(() => {
    global.Date.now = jest.fn(() => fakeDate.getTime())
    resMock = createResponse()
    nextMock = jest.fn()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  afterAll(() => {
    global.Date.now = realDate
  })

  it('should allow some paths even with more than 10 requests in 1 minute', () => {
    reqMock = createRequest({
      method: 'GET',
      path: '/',
      ip: '111.0.0.1',
    })
    Array.from({ length: 10 }).forEach(() => {
      rateLimiterMiddleware(reqMock, resMock, nextMock)
      expect(nextMock).toHaveBeenCalled()
    })
    // 11th time
    rateLimiterMiddleware(reqMock, resMock, nextMock)
    expect(nextMock).toHaveBeenCalled()
    expect(resMock.statusCode).toBe(200)
  })

  it.each([
    ['/otp/verify', '222.0.0.1'],
    ['/feedback/complete', '222.0.0.2'],
  ])('should restrict path %s with more than 10 requests in 1 minute', (path: string, ip: string) => {
    reqMock = createRequest({
      method: 'POST',
      path,
      ip,
    })
    Array.from({ length: 10 }).forEach(() => {
      rateLimiterMiddleware(reqMock, resMock, nextMock)
      expect(nextMock).toHaveBeenCalled()
    })
    // 11th time
    rateLimiterMiddleware(reqMock, resMock, nextMock)
    expect(resMock.statusCode).toBe(429)
  })

  it('should allow a restricted path from 5 different ips more than 10 requests in 1 minute', () => {
    Array.from({ length: 5 }).forEach((_, i: number) => {
      reqMock = createRequest({
        method: 'GET',
        path: '/otp/verify',
        ip: `333.0.0.${i}`,
      })

      // 10 requests from each ip are allowed
      Array.from({ length: 10 }).forEach(() => {
        rateLimiterMiddleware(reqMock, resMock, nextMock)
        expect(nextMock).toHaveBeenCalled()
        expect(resMock.statusCode).toBe(200)
      })
    })
  })

  it('today should be mocked', () => {
    const today = Date.now()
    expect(new Date(today).toLocaleDateString('en-GB')).toBe('01/01/2024')
  })

  it('counter should reset after 1 minute', () => {
    reqMock = createRequest({
      method: 'POST',
      path: '/otp/verify',
      ip: '444.0.0.1',
    })
    // make more than 10 calls per minute
    Array.from({ length: 11 }).forEach(() => {
      rateLimiterMiddleware(reqMock, resMock, nextMock)
    })
    expect(resMock.statusCode).toBe(429)

    // fake a minute has passed
    resMock = createResponse()
    nextMock = jest.fn()
    const fakeDatePlusOneMinute = addSeconds(fakeDate, 60)
    global.Date.now = jest.fn(() => fakeDatePlusOneMinute.getTime())

    // call again for the 12th time
    rateLimiterMiddleware(reqMock, resMock, nextMock)
    expect(resMock.statusCode).toBe(200)
    expect(nextMock).toHaveBeenCalled()
  })

  it('counter should not reset after 59 seconds', () => {
    reqMock = createRequest({
      method: 'POST',
      path: '/otp/verify',
      ip: '555.0.0.1',
    })
    // make more than 10 calls per minute
    Array.from({ length: 11 }).forEach(() => {
      rateLimiterMiddleware(reqMock, resMock, nextMock)
    })
    expect(resMock.statusCode).toBe(429)

    // fake a minute has passed
    resMock = createResponse()
    nextMock = jest.fn()
    const fakeDatePlusOneMinute = addSeconds(fakeDate, 59)
    global.Date.now = jest.fn(() => fakeDatePlusOneMinute.getTime())

    // call again for the 12th time
    rateLimiterMiddleware(reqMock, resMock, nextMock)
    expect(nextMock).not.toHaveBeenCalled()
    expect(resMock.statusCode).toBe(429)
  })
})
