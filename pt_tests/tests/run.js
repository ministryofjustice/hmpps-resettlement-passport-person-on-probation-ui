import { Trend, Rate, Counter, Gauge } from 'k6/metrics'

export { resettlementPassportApi } from './apiTestsAuth.js'
export { setup } from './apiTestsAuth.js'
export { mainDevBrowserTest } from './browserTests.js'

export const errorRate = new Rate('errors')
const executionType = __ENV.EXECUTION_TYPE
console.log(__ENV.EXECUTION_TYPE)

const ExecutionOptions_Scenarious = getScenarios(executionType)

export const options = {
  scenarios: ExecutionOptions_Scenarious,
  insecureSkipTLSVerify: true,
  thresholds: {
    browser_http_req_failed: ['rate<0.01'], // http errors should be less than 1%
    browser_http_req_duration: ['p(90)<200', 'p(99.9)<500'], // 90% of requests should be below 200ms / 99% of requests should be below 500ms
    http_req_failed: ['rate<0.01'], // http errors should be less than 1%
    http_req_duration: ['p(95)<200'], // 95% of requests should be below 200ms
  },
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
    case 'stress': {
      return {
        browserTest: {
          executor: 'constant-arrival-rate',
          exec: 'mainDevBrowserTest',
          rate: 20,
          timeunit: '2m',
          preAllocatedVUs: 10,
          duration: '2m',
          options: {
            browser: {
              type: 'chromium',
            },
          },
        },
      }
    }
    case 'load': {
      return {
        browserTest: {
          executor: 'constant-arrival-rate',
          exec: 'mainDevBrowserTest',
          rate: 20,
          timeunit: '10m',
          preAllocatedVUs: 10,
          duration: '10m',
          options: {
            browser: {
              type: 'chromium',
            },
          },
        },
      }
    }
    case 'soak': {
      return {
        browserTest: {
          executor: 'constant-arrival-rate',
          exec: 'mainDevBrowserTest',
          rate: 100,
          timeunit: '60m',
          preAllocatedVUs: 30,
          duration: '60m',
          options: {
            browser: {
              type: 'chromium',
            },
          },
        },
      }
    }
    case 'apiSmoke': {
      return {
        api: {
          executor: 'shared-iterations',
          exec: 'resettlementPassportApi',
          vus: 1,
          iterations: 1,
          maxDuration: '30s',
        },
      }
    }
    case 'api': {
      return {
        api: {
          executor: 'shared-iterations',
          exec: 'resettlementPassportApi',
          vus: 10,
          iterations: 1500,
          maxDuration: '2m',
        },
      }
    }
  }
}
