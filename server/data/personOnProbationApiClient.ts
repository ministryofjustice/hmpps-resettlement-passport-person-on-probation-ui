/* eslint-disable @typescript-eslint/no-explicit-any */
import RestClient from './restClient'
import config from '../config'
import logger from '../../logger'
import { checkError } from './checkError'

export interface UserDetailsResponse {
  id: number
  crn: string
  cprId: string
  email: string
  verified: boolean
  nomsId: string
  oneLoginUrn: string
}

export default class PersonOnProbationUserApiClient {
  restClient: RestClient

  constructor() {
    this.restClient = new RestClient('Person On Probation User Api Client', config.apis.personOnProbationUserApi)
  }

  async getUserByUrn(urn: string, sessionId: string): Promise<UserDetailsResponse | null> {
    try {
      const user = await this.restClient.get<UserDetailsResponse>({
        path: `/onelogin/user/${urn}`,
        headers: {
          SessionID: sessionId,
        },
      })
      return user
    } catch (error) {
      logger.warn(`SessionId: ${sessionId}. User not found, assuming unverified`)
      checkError(error)
    }
    return null
  }
}
