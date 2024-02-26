import { SuperAgentRequest } from 'superagent'
import { stubFor } from './wiremock'

const mockedOtpResponse = {
  id: 9,
  crn: 'U416100',
  cprId: 'NA',
  email: 'test@example.com',
  verified: true,
  creationDate: '2024-02-26T11:58:17.812884699',
  modifiedDate: '2024-02-26T11:58:17.812884699',
  nomsId: 'G4161UF',
  oneLoginUrn: 'urn:fdc:gov.asdasdasd',
}

const mockedUserDetailsResponse = {
  personalDetails: {
    prisonerNumber: '123123',
    prisonId: '33',
    firstName: 'John',
    middleNames: 'Paul',
    lastName: 'Smith',
    age: 44,
  },
}

export default {
  stubGetPopUserOtp: (): SuperAgentRequest =>
    stubFor({
      request: {
        method: 'POST',
        url: `/rpApi/popUser/onelogin/verify`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: mockedOtpResponse,
      },
    }),
  stubGetPopUserDetails: (): SuperAgentRequest =>
    stubFor({
      request: {
        method: 'GET',
        url: `/rpApi/prisoner/G4161UF`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: mockedUserDetailsResponse,
      },
    }),
}
