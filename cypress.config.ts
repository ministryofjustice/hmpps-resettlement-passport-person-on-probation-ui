import { defineConfig } from 'cypress'
import fs from 'fs'
import { resetStubs } from './integration_tests/mockApis/wiremock'
import govukOneLogin from './integration_tests/mockApis/govukOneLogin'
import psfrApi from './integration_tests/mockApis/psfrApi'
import popApi from './integration_tests/mockApis/popApi'
import hmppsAuth from './integration_tests/mockApis/hmppsAuth'
import zendeskApi from './integration_tests/mockApis/zendeskApi'

const flagFilePath = './localstack/flags.json'
const flagRestoreFilePath = './integration_tests/flags.restore.json'

const flagsDisabled = [
  {
    feature: 'viewAppointmentsEndUser',
    enabled: false,
  },
]

const overwriteFlags = (content: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    fs.writeFile(flagFilePath, content, 'utf8', err => {
      if (err) {
        reject(err)
      } else {
        resolve(true)
      }
    })
  })
}

const disableAppointmentFlag = (): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    overwriteFlags(JSON.stringify(flagsDisabled))
      .then(() => resolve(true))
      .catch(err2 => reject(err2))
  })
}

const restoreFlags = (): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    fs.readFile(flagRestoreFilePath, 'utf8', (err, data) => {
      if (err) {
        reject(err)
      } else {
        overwriteFlags(data)
          .then(() => resolve(true))
          .catch(err2 => reject(err2))
      }
    })
  })
}

export default defineConfig({
  chromeWebSecurity: false,
  fixturesFolder: 'integration_tests/fixtures',
  screenshotsFolder: 'integration_tests/screenshots',
  videosFolder: 'integration_tests/videos',
  reporter: 'cypress-multi-reporters',
  reporterOptions: {
    configFile: 'reporter-config.json',
  },
  retries: {
    runMode: 0,
    openMode: 0,
  },
  taskTimeout: 60000,
  e2e: {
    setupNodeEvents(on) {
      on('task', {
        reset: resetStubs,
        // Add all the mock apis below
        ...hmppsAuth,
        ...govukOneLogin,
        ...psfrApi,
        ...popApi,
        ...zendeskApi,
        log(message) {
          // eslint-disable-next-line no-console
          console.log(message)
          return null
        },
        table(message) {
          // eslint-disable-next-line no-console
          console.table(message)
          return null
        },
        restoreFlags,
        overwriteFlags,
        disableAppointmentFlag,
      })
    },
    baseUrl: 'http://localhost:3007',
    excludeSpecPattern: '**/!(*.cy).ts',
    specPattern: 'integration_tests/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'integration_tests/support/index.ts',
  },
})
