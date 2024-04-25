import { SanitisedError } from '../sanitisedError'
import { checkError } from './checkError'

describe('checkError', () => {
  it('should throw for 500', () => {
    const error = {
      status: 500,
      data: {
        status: 500,
        errorCode: null,
        userMessage:
          'Unexpected error: 500 Internal Server Error from POST http://hmpps-resettlement-passport-api-stubs/cvl-api/licence/match',
        developerMessage:
          '500 Internal Server Error from POST http://hmpps-resettlement-passport-api-stubs/cvl-api/licence/match',
        moreInfo: null,
      },
    } as SanitisedError

    const callable = () => {
      checkError(error)
    }
    expect(callable).toThrow(Error)
  })

  it('should not throw for 404', () => {
    const error = {
      status: 404,
      data: {},
    } as SanitisedError

    const callable = () => {
      checkError(error)
    }
    expect(callable).not.toThrow(Error)
  })
})
