import { dataAccess } from '../data'
import UserService from './userService'

export const services = () => {
  const { applicationInfo, resettlementPassportApiClient } = dataAccess()

  const userService = new UserService(resettlementPassportApiClient)

  return {
    applicationInfo,
    userService,
  }
}

export type Services = ReturnType<typeof services>

export {}
