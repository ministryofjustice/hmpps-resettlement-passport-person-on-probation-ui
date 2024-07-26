import { defineConfig } from 'cypress'
import fs from 'fs/promises'
import { resetStubs } from './integration_tests/mockApis/wiremock'
import govukOneLogin from './integration_tests/mockApis/govukOneLogin'
import psfrApi from './integration_tests/mockApis/psfrApi'
import popApi from './integration_tests/mockApis/popApi'
import hmppsAuth from './integration_tests/mockApis/hmppsAuth'
import zendeskApi from './integration_tests/mockApis/zendeskApi'
import { Feature } from './server/services/featureFlags'

const flagFilePath = './localstack/flags.json'
const flagRestoreFilePath = './integration_tests/flags.restore.json'

const overwriteFlags = async (content: string): Promise<void> => {
  await fs.writeFile(flagFilePath, content, { encoding: 'utf-8' })
}

const disableFlag = async (flagKey: string): Promise<boolean> => {
  const flagsData = await fs.readFile(flagRestoreFilePath, { encoding: 'utf-8' })
  const flags: Feature[] = JSON.parse(flagsData)
  const flag = flags.find(f => f.feature === flagKey)

  if (!flag) {
    throw Error(`No flag ${flagKey} to disable`)
  }
  flag.enabled = false
  await overwriteFlags(JSON.stringify(flags))
  return true
}

const restoreFlags = async (): Promise<boolean> => {
  await fs.copyFile(flagRestoreFilePath, flagFilePath)
  return true
}

const retries = process.env.CYPRESS_RETRIES || '1'

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
    runMode: parseInt(retries, 10),
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
        disableFlag,
      })
      on('after:run', () => restoreFlags())
    },
    baseUrl: 'http://localhost:3007',
    excludeSpecPattern: '**/!(*.cy).ts',
    specPattern: 'integration_tests/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'integration_tests/support/index.ts',
  },
})
