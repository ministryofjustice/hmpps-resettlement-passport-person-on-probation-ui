import { dataAccess } from '../data'
import AppointmentService from './appointmentService'
import FeatureFlagsService from './featureFlagsService'
import LicenceConditionsService from './licenceConditionsService'
import UserService from './userService'
import ZendeskService from './zendeskService'
import DocumentService from './documentService'
import TodoService from './todoService'

export const services = () => {
  const { applicationInfo, resettlementPassportApiClient, personOnProbationUserApiClient, appInsightsClient } =
    dataAccess()

  const userService = new UserService(resettlementPassportApiClient, personOnProbationUserApiClient)
  const appointmentService = new AppointmentService(resettlementPassportApiClient)
  const licenceConditionService = new LicenceConditionsService(resettlementPassportApiClient)
  const zendeskService = new ZendeskService()
  const featureFlagsService = new FeatureFlagsService()
  const documentService = new DocumentService(resettlementPassportApiClient)
  const todoService = new TodoService()

  return {
    applicationInfo,
    userService,
    appointmentService,
    licenceConditionService,
    zendeskService,
    appInsightsClient,
    featureFlagsService,
    documentService,
    todoService,
  }
}

export type Services = ReturnType<typeof services>

export {}
