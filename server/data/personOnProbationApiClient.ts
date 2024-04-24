/* eslint-disable @typescript-eslint/no-explicit-any */
import RestClient from './restClient'
import config from '../config'
import logger from '../../logger'

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

  async getUserByUrn(urn: string): Promise<UserDetailsResponse | null> {
    try {
      const user = await this.restClient.get<UserDetailsResponse>({ path: `/onelogin/user/${urn}` })
      return user
    } catch (error) {
      logger.debug('User not found, assuming unverified')
      if (error.status !== 404) throw new Error(error)
    }
    return null
  }
}
