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

  async getLicenceConditionsImage(nomsId: string, licenceId: number, conditionId: number): Promise<string> {
    try {
      const imageResult = await this.restClient.get<string>({
        path: `/prisoner/${nomsId}/licence-condition/id/${licenceId}/condition/${conditionId}/image`,
      })

      return Buffer.from(imageResult).toString('base64')
    } catch (error) {
      logger.error('Licence condition image not found:', error)
      if (error.status !== 404) throw new Error(error)
    }
    return null
  }

  async getLicenceConditionsByNomsId(nomsId: string): Promise<LicenceConditionData> {
    try {
      const response = await this.restClient.get<LicenceConditionData>({
        path: `/prisoner/${nomsId}/licence-condition`,
      })
      return response
    } catch (error) {
      logger.error('Licence conditions not found:', error)
      if (error.status !== 404) throw new Error(error)
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
      logger.error('Prisoner not found:', error)
      if (error.status !== 404) throw new Error(error)
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
      logger.error('Prisoner appointments not found:', error)
      if (error.status !== 404) throw new Error(error)
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
      logger.error('OTP not found:', error)
      if (error.status !== 404) throw new Error(error)
    }
    return null
  }
}
