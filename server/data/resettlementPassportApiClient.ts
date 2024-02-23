/* eslint-disable @typescript-eslint/no-explicit-any */
import RestClient from './restClient'
import config from '../config'
import logger from '../../logger'

export interface OtpDetailsResponse {
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

export interface OtpRequest {
  urn: string
  otp: string
  email: string
}

export default class ResettlementPassportApiClient {
  restClient: RestClient

  constructor() {
    this.restClient = new RestClient('Resettlement Passport Api Client', config.apis.resettlementPassportApi)
  }

  async submitUserOtp(otpRequest: OtpRequest): Promise<OtpDetailsResponse> {
    try {
      const response = await this.restClient.post<OtpDetailsResponse>({
        path: `/popUser/onelogin/verify`,
        data: otpRequest,
      })
      return response
    } catch (error) {
      logger.debug('OTP not found')
    }
    return null
  }
}
