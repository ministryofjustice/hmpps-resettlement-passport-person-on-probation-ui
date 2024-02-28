import { dataAccess } from '../data'
import AppointmentService from './appointmentService'
import UserService from './userService'

export const services = () => {
  const { applicationInfo, resettlementPassportApiClient, personOnProbationUserApiClient } = dataAccess()

  const userService = new UserService(resettlementPassportApiClient, personOnProbationUserApiClient)
  const appointmentService = new AppointmentService(resettlementPassportApiClient)

  return {
    applicationInfo,
    userService,
    appointmentService,
  }
}

export type Services = ReturnType<typeof services>

export {}
