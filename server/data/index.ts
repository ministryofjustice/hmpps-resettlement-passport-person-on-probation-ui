/* eslint-disable import/first */
/*
 * Do appinsights first as it does some magic instrumentation work, i.e. it affects other 'require's
 * In particular, applicationinsights automatically collects bunyan logs
 */
import { initialiseAppInsights, buildAppInsightsClient } from '../utils/azureAppInsights'
import applicationInfoSupplier from '../applicationInfo'
import ResettlementPassportApiClient from './resettlementPassportApiClient'
import PersonOnProbationUserApiClient from './personOnProbationApiClient'

const applicationInfo = applicationInfoSupplier()
initialiseAppInsights()
const appInsightsClient = buildAppInsightsClient(applicationInfo)

type RestClientBuilder<T> = (token: string) => T

export const dataAccess = () => ({
  applicationInfo,
  appInsightsClient,
  resettlementPassportApiClient: new ResettlementPassportApiClient(),
  personOnProbationUserApiClient: new PersonOnProbationUserApiClient(),
})

export type DataAccess = ReturnType<typeof dataAccess>

export { RestClientBuilder }
