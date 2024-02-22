/* eslint-disable @typescript-eslint/no-explicit-any */
import RestClient from './restClient'
import config from '../config'

interface UserDetailsResponse {
  id: number
  crn: 'string'
  cprId: 'string'
  email: 'string'
  verified: boolean
  nomsId: 'string'
  oneLoginUrn: 'string'
}

export default class PersonOnProbationUserApiclient {
  restClient: RestClient

  constructor() {
    this.restClient = new RestClient('Person On Probation User Api Client', config.apis.personOnProbationUserApi)
  }

  async getUserByUrn(urn: string): Promise<UserDetailsResponse> {
    return this.restClient.get<UserDetailsResponse>({ path: `/onelogin/user/${urn}` })
  }
}
