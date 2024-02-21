import { SuperAgentRequest } from 'superagent'
import { stubFor } from './wiremock'

export default {
  stubHmppsToken: (): SuperAgentRequest =>
    stubFor({
      request: {
        method: 'POST',
        url: '/hmppsAuth/oauth/token?grant_type=client_credentials',
      },
      response: {
        status: 200,
        jsonBody: {
          access_token: 'hmpps-auth-token',
          token_type: 'bearer',
          expires_in: 3599,
          scope: 'read write',
          sub: 'hmpps-resettlement-passport-person-on-probation-ui-client-1',
          auth_source: 'none',
          jti: 'asdasd-asdasd',
          iss: 'https://sign-in-dev.hmpps.service.justice.gov.uk/auth/issuer',
        },
      },
    }),
}
