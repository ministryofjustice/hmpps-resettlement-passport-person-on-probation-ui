/* eslint-disable @typescript-eslint/no-explicit-any */
import RestClient from './restClient'
import config from '../config'

interface OtpDetailsResponse {
  id: number
  prisoner: {
    id: number
    nomsId: string
    creationDate: string
    crn: string
    prisonId: string
    releaseDate: string
  }
  creationDate: string
  expiryDate: string
  otp: number
}

export default class ResettlementPassportApiClient {
  restClient: RestClient

  constructor() {
    this.restClient = new RestClient('Resettlement Passport Api Client', config.apis.resettlementPassportApi)
  }

  async submitUserOtp(popUser: string): Promise<OtpDetailsResponse> {
    return this.restClient.get<OtpDetailsResponse>({ path: `/popUser/${popUser}/otp` })
  }
}
