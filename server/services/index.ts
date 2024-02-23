import { dataAccess } from '../data'
import UserService from './userService'

export const services = () => {
  const { applicationInfo, resettlementPassportApiClient, personOnProbationUserApiClient } = dataAccess()

  const userService = new UserService(resettlementPassportApiClient, personOnProbationUserApiClient)

  return {
    applicationInfo,
    userService,
  }
}

export type Services = ReturnType<typeof services>

export {}
