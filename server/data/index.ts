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

export const dataAccess = () => ({
  applicationInfo,
  appInsightsClient,
  resettlementPassportApiClient: new ResettlementPassportApiClient(),
  personOnProbationUserApiClient: new PersonOnProbationUserApiClient(),
})
