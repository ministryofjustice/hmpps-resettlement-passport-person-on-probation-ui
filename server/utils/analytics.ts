import { TelemetryClient } from 'applicationinsights'

export enum PyfEvent {
  TIMEOUT_EVENT = 'PYF_SessionTimeout',
  REGISTRATION_ERROR_EVENT = 'PYF_FirstTimeRegistrationError',
}

export type KeyValue = {
  key: string
  value: string
}

export const trackEvent = (
  appInsightsClient: TelemetryClient,
  name: string,
  properties: KeyValue[],
  userId: string,
  sessionId: string,
) => {
  if (name && appInsightsClient) {
    appInsightsClient.context.tags[appInsightsClient.context.keys.userId] = userId

    appInsightsClient.context.tags[appInsightsClient.context.keys.sessionId] = sessionId

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

export const userProperties = (userId: string) => {
  return [{ key: 'userId', value: userId }]
}

export const errorProperties = (errors: Array<Express.ValidationError>, userId: string) => {
  return [...mapErrorsToAnalytics(errors), ...userProperties(userId)]
}
