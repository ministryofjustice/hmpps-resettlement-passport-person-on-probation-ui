import { dataAccess } from '../data'
import AppointmentService from './appointmentService'
import LicenceConditionsService from './licenceConditionsService'
import UserService from './userService'

export const services = () => {
  const { applicationInfo, resettlementPassportApiClient, personOnProbationUserApiClient } = dataAccess()

  const userService = new UserService(resettlementPassportApiClient, personOnProbationUserApiClient)
  const appointmentService = new AppointmentService(resettlementPassportApiClient)
  const licenceConditionService = new LicenceConditionsService(resettlementPassportApiClient)

  return {
    applicationInfo,
    userService,
    appointmentService,
    licenceConditionService,
  }
}

export type Services = ReturnType<typeof services>

export {}
