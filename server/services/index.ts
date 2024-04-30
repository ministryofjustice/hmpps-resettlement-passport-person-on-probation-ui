import { dataAccess } from '../data'
import AppointmentService from './appointmentService'
import LicenceConditionsService from './licenceConditionsService'
import UserService from './userService'
import ZendeskService from './zendeskService'

export const services = () => {
  const { applicationInfo, resettlementPassportApiClient, personOnProbationUserApiClient } = dataAccess()

  const userService = new UserService(resettlementPassportApiClient, personOnProbationUserApiClient)
  const appointmentService = new AppointmentService(resettlementPassportApiClient)
  const licenceConditionService = new LicenceConditionsService(resettlementPassportApiClient)
  const zendeskService = new ZendeskService()

  return {
    applicationInfo,
    userService,
    appointmentService,
    licenceConditionService,
    zendeskService,
  }
}

export type Services = ReturnType<typeof services>

export {}
