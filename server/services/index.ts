import { dataAccess } from '../data'
import UserService from './userService'

export const services = () => {
  const { applicationInfo, resettlementPassportApiClient, personOnProbationuserApiclient } = dataAccess()

  const userService = new UserService(resettlementPassportApiClient, personOnProbationuserApiclient)

  return {
    applicationInfo,
    userService,
  }
}

export type Services = ReturnType<typeof services>

export {}
