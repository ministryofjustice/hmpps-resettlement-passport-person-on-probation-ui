import { SuperAgentRequest } from 'superagent'
import { stubFor } from './wiremock'

const mockedResponse = {
  id: 3,
  prisoner: {
    id: 2,
    nomsId: 'G4161UF',
    creationDate: '2023-08-29T10:49:36.114432',
    crn: 'U416100',
    prisonId: 'MDI',
    releaseDate: '2024-08-01',
  },
  creationDate: '2024-02-21T11:14:41.939462',
  expiryDate: '2024-02-28T23:59:59.939462',
  otp: 123456,
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
        jsonBody: mockedResponse,
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
