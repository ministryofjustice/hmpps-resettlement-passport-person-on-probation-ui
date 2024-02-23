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

export interface PersonalDetails {
  personalDetails: {
    prisonerNumber: string
    prisonId: string
    firstName: string
    middleNames: string
    lastName: string
    releaseDate: Date
    releaseType: string
    dateOfBirth: Date
    age: number
    location: string
    facialImageId: string
  }
  pathways: [
    {
      pathway: string
      status: string
      lastDateChange: Date
    },
  ]
  assessmentRequired: true
}

export default class ResettlementPassportApiClient {
  restClient: RestClient

  constructor() {
    this.restClient = new RestClient('Resettlement Passport Api Client', config.apis.resettlementPassportApi)
  }

  async getByNomsId(nomsId: string): Promise<PersonalDetails> {
    try {
      const response = await this.restClient.get<PersonalDetails>({
        path: `/prisoner/${nomsId}`,
      })
      return response
    } catch (error) {
      logger.debug('Prisoner not found')
    }
    return null
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
