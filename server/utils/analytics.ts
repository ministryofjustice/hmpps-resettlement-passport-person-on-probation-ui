import { dataAccess } from '../data'

const { appInsightsClient } = dataAccess()

export type KeyValue = {
  key: string
  value: string
}

export const trackEvent = (name: string, properties: KeyValue[]) => {
  if (name && appInsightsClient) {
    appInsightsClient.trackEvent({ name, properties })
    appInsightsClient.flush()
  }
}
