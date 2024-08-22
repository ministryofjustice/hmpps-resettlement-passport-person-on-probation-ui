import { ReadableStream } from 'node:stream/web'
import RestClient from './restClient'
import config from '../config'
import logger from '../../logger'

import {
  AppointmentData,
  LicenceConditionData,
  DocumentMeta,
  OtpDetailsResponse,
  OtpRequest,
  PersonalDetails,
  UserDocumentType,
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
      return this.restClient.get<LicenceConditionData>({
        path: `/prisoner/${nomsId}/licence-condition?includeChangeNotify=true`,
        headers: {
          SessionID: sessionId,
        },
      })
    } catch (error) {
      logger.error(`SessionId: ${sessionId}. Licence conditions not found:`, error)
      checkError(error)
    }
    return null
  }

  async getByNomsId(nomsId: string, sessionId: string): Promise<PersonalDetails> {
    try {
      logger.debug(`SessionId: ${sessionId}. getByNomsId(${nomsId})`)
      return this.restClient.get<PersonalDetails>({
        path: `/prisoner/${nomsId}?includeProfileTags=true`,
        headers: {
          SessionID: sessionId,
        },
      })
    } catch (error) {
      logger.error(`SessionId: ${sessionId}. Prisoner not found:`, error)
      checkError(error)
    }
    return null
  }

  async getAppointments(nomsId: string, sessionId: string): Promise<AppointmentData> {
    try {
      logger.debug(`SessionId: ${sessionId}. getAppointments(${nomsId})`)
      return await this.restClient.get<AppointmentData>({
        path: `/prisoner/${nomsId}/appointments?futureOnly=false&includePreRelease=false`,
        headers: {
          SessionID: sessionId,
        },
      })
    } catch (error) {
      logger.error(`SessionId: ${sessionId}. Prisoner appointments not found:`, error)
      checkError(error)
    }
    return null
  }

  async submitUserOtp(otpRequest: OtpRequest, sessionId: string): Promise<OtpDetailsResponse> {
    try {
      logger.debug(`SessionId: ${sessionId}. submitUserOtp()`)
      return this.restClient.post<OtpDetailsResponse>({
        path: `/popUser/onelogin/verify`,
        data: otpRequest,
        headers: {
          SessionID: sessionId,
        },
      })
    } catch (error) {
      logger.error(`SessionId: ${sessionId}. OTP not found:`, error)
      checkError(error)
    }
    return null
  }

  async confirmLicenceConditions(nomsId: string, version: number, sessionId: string): Promise<void> {
    try {
      logger.debug(`SessionId: ${sessionId}. confirmLicenceConditions()`)
      await this.restClient.patch({
        path: `/prisoner/${nomsId}/licence-condition/seen?version=${version}`,
        headers: {
          SessionID: sessionId,
        },
      })
    } catch (error) {
      logger.error(`SessionId: ${sessionId}. Licence condition version '${version}' not found:`, error)
      checkError(error)
    }
  }

  async getLicenceConditionsDocuments(nomsId: string, sessionId: string): Promise<DocumentMeta[]> {
    try {
      logger.debug(`SessionId: ${sessionId}. getLicenceConditionsDocuments()`)
      return this.restClient.get<DocumentMeta[]>({
        path: `/prisoner/${nomsId}/documents?category=LICENCE_CONDITIONS`,
        headers: {
          SessionID: sessionId,
        },
      })
    } catch (error) {
      logger.error(`SessionId: ${sessionId}. Error fetching documents list:`, error)
      checkError(error)
      return []
    }
  }

  async getDocument(nomsId: string, docType: UserDocumentType, sessionId: string): Promise<ReadableStream<Uint8Array>> {
    try {
      logger.debug(`SessionId: ${sessionId}. getLicenceConditionsDocument(${docType})`)
      return this.restClient.download({
        path: `/prisoner/${nomsId}/documents/latest/download?category=${docType}`,
        headers: {
          SessionID: sessionId,
        },
      })
    } catch (error) {
      logger.error(`SessionId: ${sessionId}. Error fetching documents ${docType} for ${nomsId}`, error)
      throw error
    }
  }
}
