import { SuperAgentRequest } from 'superagent'
import { stubFor } from './wiremock'

const mockedResponse = {
  ticket: {
    id: 123456
  }
}

export default {
  stubCreateTicket: (): SuperAgentRequest =>
    stubFor({
      request: {
        method: 'POST',
        url: `/zenDesk/api/v2/tickets`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: mockedResponse,
      },
    })
}
