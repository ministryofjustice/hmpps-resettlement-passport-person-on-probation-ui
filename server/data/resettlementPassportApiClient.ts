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
import { checkError } from './checkError'

export default class ResettlementPassportApiClient {
  restClient: RestClient

  constructor() {
    this.restClient = new RestClient('Resettlement Passport Api Client', config.apis.resettlementPassportApi)
  }

  async getLicenceConditionsImage(
    nomsId: string,
    licenceId: number,
    conditionId: number,
    sessionId: string,
  ): Promise<string> {
    try {
      logger.debug(`SessionId: ${sessionId}. getLicenceConditionsImage(${nomsId}, ${licenceId}, ${conditionId})`)
      const imageResult = await this.restClient.get<string>({
        path: `/prisoner/${nomsId}/licence-condition/id/${licenceId}/condition/${conditionId}/image`,
        headers: {
          SessionID: sessionId,
        },
      })

      return Buffer.from(imageResult).toString('base64')
    } catch (error) {
      logger.error(`SessionId: ${sessionId}. Licence condition image not found:`, error)
      checkError(error)
    }
    return null
  }

  async getLicenceConditionsByNomsId(nomsId: string, sessionId: string): Promise<LicenceConditionData> {
    try {
      logger.debug(`SessionId: ${sessionId}. getLicenceConditionsByNomsId(${nomsId})`)
      const response = await this.restClient.get<LicenceConditionData>({
        path: `/prisoner/${nomsId}/licence-condition?includeChangeNotify=true`,
        headers: {
          SessionID: sessionId,
        },
      })
      return response
    } catch (error) {
      logger.error(`SessionId: ${sessionId}. Licence conditions not found:`, error)
      checkError(error)
    }
    return null
  }

  async getByNomsId(nomsId: string, sessionId: string): Promise<PersonalDetails> {
    try {
      logger.debug(`SessionId: ${sessionId}. getByNomsId(${nomsId})`)
      const response = await this.restClient.get<PersonalDetails>({
        path: `/prisoner/${nomsId}`,
        headers: {
          SessionID: sessionId,
        },
      })
      return response
    } catch (error) {
      logger.error(`SessionId: ${sessionId}. Prisoner not found:`, error)
      checkError(error)
    }
    return null
  }

  async getAppointments(nomsId: string, sessionId: string): Promise<AppointmentData> {
    try {
      logger.debug(`SessionId: ${sessionId}. getAppointments(${nomsId})`)
      const response = await this.restClient.get<AppointmentData>({
        path: `/prisoner/${nomsId}/appointments?futureOnly=false&includePreRelease=false`,
        headers: {
          SessionID: sessionId,
        },
      })
      return response
    } catch (error) {
      logger.error(`SessionId: ${sessionId}. Prisoner appointments not found:`, error)
      checkError(error)
    }
    return null
  }

  async submitUserOtp(otpRequest: OtpRequest, sessionId: string): Promise<OtpDetailsResponse> {
    try {
      logger.debug(`SessionId: ${sessionId}. submitUserOtp()`)
      const response = await this.restClient.post<OtpDetailsResponse>({
        path: `/popUser/onelogin/verify`,
        data: otpRequest,
        headers: {
          SessionID: sessionId,
        },
      })
      return response
    } catch (error) {
      logger.error(`SessionId: ${sessionId}. OTP not found:`, error)
      checkError(error)
    }
    return null
  }
}
