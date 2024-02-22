import { SuperAgentRequest } from 'superagent'
import { stubFor } from './wiremock'
import { oneLoginUrn } from './govukOneLogin'

const mockedResponse = {
  id: 3,
  crn: 'U416100',
  email: 'string',
  verified: true,
  creationDate: '2021-07-05T10:35:17',
  modifiedDate: '2021-07-05T10:35:17',
  nomsId: 'G4161UF',
  oneLoginUrn,
}

export default {
  stubGetPopUserByUrn: (urn: string): SuperAgentRequest =>
    stubFor({
      request: {
        method: 'GET',
        url: `/popApi/onelogin/user/${urn}`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: mockedResponse,
      },
    }),
}
