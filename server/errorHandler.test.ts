import request from 'supertest'
import { appWithAllRoutes } from './routes/testutils/appSetup'

beforeEach(() => {
  appWithAllRoutes({})
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('GET 500', () => {
  it('should render error page with a user friendly title in Production mode', () => {
    return request(appWithAllRoutes({ production: true }))
      .get('/dashboard')
      .expect(500)
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('Something went wrong. The error has been logged. Please try again')
      })
  })
  it('should render error page without the user friendly title in Dev mode', () => {
    return request(appWithAllRoutes({ production: false }))
      .get('/dashboard')
      .expect(500)
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).not.toContain('Something went wrong. The error has been logged. Please try again')
      })
  })
})
