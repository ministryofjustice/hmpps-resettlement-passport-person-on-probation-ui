import request from 'supertest'
import { appWithAllRoutes } from './routes/testutils/appSetup'
import { friendlyErrorMessage } from './errorHandler'

beforeEach(() => {
  appWithAllRoutes({})
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('GET 500', () => {
  it('should render error page without the error info in Production mode', () => {
    return request(appWithAllRoutes({ production: true }))
      .get('/dashboard')
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain(friendlyErrorMessage)
        expect(res.text).not.toContain('Error info:')
      })
  })
  it('should render error page with the error info in Dev mode', () => {
    return request(appWithAllRoutes({ production: false }))
      .get('/dashboard')
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain(friendlyErrorMessage)
        expect(res.text).toContain('Error info:')
      })
  })
})
