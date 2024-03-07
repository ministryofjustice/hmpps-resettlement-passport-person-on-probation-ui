/* eslint-disable @typescript-eslint/no-explicit-any */
import RestClient from './restClient'
import config from '../config'
import logger from '../../logger'

import type {
  AppointmentData,
  LicenceConditionData,
  OtpDetailsResponse,
  OtpRequest,
  PersonalDetails,
} from './resettlementPassportData'

export default class ResettlementPassportApiClient {
  restClient: RestClient

  constructor() {
    this.restClient = new RestClient('Resettlement Passport Api Client', config.apis.resettlementPassportApi)
  }

  async getLicenceConditionsByNomsId(nomsId: string): Promise<LicenceConditionData> {
    try {
      const response = await this.restClient.get<LicenceConditionData>({
        path: `/prisoner/${nomsId}/licence-condition`,
      })
      return response
    } catch (error) {
      logger.debug('Prisoner not found')
    }
    return null
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
        path: `/prisoner/${nomsId}/appointments?futureOnly=false`,
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
