import { TelemetryClient } from 'applicationinsights'

export type KeyValue = {
  key: string
  value: string
}

export const trackEvent = (appInsightsClient: TelemetryClient, name: string, properties: KeyValue[]) => {
  if (name && appInsightsClient) {
    appInsightsClient.trackEvent({ name, properties })
    appInsightsClient.flush()
  }
}

function mapErrorsToAnalytics(errors: Array<Express.ValidationError>): KeyValue[] {
  return errors.map(item => {
    return {
      key: 'errorField',
      value: item.href,
    }
  })
}

export const errorProperties = (errors: Array<Express.ValidationError>, userId: string) => {
  return [...mapErrorsToAnalytics(errors), { key: 'userId', value: userId }]
}
