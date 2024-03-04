/* eslint-disable @typescript-eslint/no-explicit-any */
import RestClient from './restClient'
import config from '../config'
import logger from '../../logger'

export interface AppointmentLocation {
  buildingName?: string
  buildingNumber?: string
  streetName?: string
  district?: string
  town?: string
  county?: string
  postcode?: string
  description?: string
}

export interface Appointment {
  id: string
  title?: string
  contact?: string
  date?: string
  time?: string
  location?: AppointmentLocation
  note?: string
}

export interface AppointmentData {
  results: Appointment[]
}

export interface OtpDetailsResponse {
  id: number
  crn?: string
  cprId?: string
  email?: string
  verified?: boolean
  creationDate?: string
  modifiedDate?: string
  nomsId?: string
  oneLoginUrn?: string
}

export interface OtpRequest {
  urn: string
  otp: string
  email: string
}

export interface PersonalDetails {
  personalDetails: {
    prisonerNumber?: string
    prisonId?: string
    firstName: string
    middleNames?: string
    lastName: string
    releaseDate?: string
    releaseType?: string
    dateOfBirth?: string
    age?: number
    location?: string
    facialImageId?: string
  }
  pathways?: [
    {
      pathway?: string
      status?: string
      lastDateChange?: string
    },
  ]
  assessmentRequired?: true
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

  async getAppointments(nomsId: string): Promise<AppointmentData> {
    try {
      const response = await this.restClient.get<AppointmentData>({
        path: `/prisoner/${nomsId}/appointments`,
      })
      return response
    } catch (error) {
      logger.debug('Prisoner appointments not found')
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
