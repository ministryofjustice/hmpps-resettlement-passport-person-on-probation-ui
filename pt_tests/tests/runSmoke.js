import { Trend, Rate, Counter, Gauge } from 'k6/metrics'

export { mainDevBrowserTest, mainPreProdBrowserTest } from './browserTests.js'

export const errorRate = new Rate('errors')
const executionType = __ENV.EXECUTION_TYPE
console.log(__ENV.EXECUTION_TYPE)

const ExecutionOptions_Scenarious = getScenarios(executionType)

export const options = {
  scenarios: ExecutionOptions_Scenarious,
  insecureSkipTLSVerify: true,
}

export function getScenarios(executionType) {
  switch (executionType) {
    case 'smoke': {
      return {
        browserTest: {
          executor: 'shared-iterations',
          exec: 'mainDevBrowserTest',
          vus: 1,
          iterations: 1,
          maxDuration: '15s',
          options: {
            browser: {
              type: 'chromium',
            },
          },
        },
      }
    }
    case 'smokePreProd': {
      return {
        browserTest: {
          executor: 'shared-iterations',
          exec: 'mainPreProdBrowserTest',
          vus: 1,
          iterations: 1,
          maxDuration: '20s',
          options: {
            browser: {
              type: 'chromium',
            },
          },
        },
      }
    }
  }
}
