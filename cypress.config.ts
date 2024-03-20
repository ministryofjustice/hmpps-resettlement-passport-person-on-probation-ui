import { defineConfig } from 'cypress'
import { resetStubs } from './cypress/mockApis/wiremock'
import govukOneLogin from './cypress/mockApis/govukOneLogin'
import psfrApi from './cypress/mockApis/psfrApi'
import popApi from './cypress/mockApis/popApi'
import hmppsAuth from './cypress/mockApis/hmppsAuth'
require('dotenv').config()

export default defineConfig({
  chromeWebSecurity: false,
  fixturesFolder: 'cypress/fixtures',
  screenshotsFolder: 'cypress/screenshots',
  videosFolder: 'cypress/videos',
  reporter: 'cypress-multi-reporters',
  reporterOptions: {
    configFile: 'reporter-config.json',
  },
  taskTimeout: 60000,
  e2e: {
    setupNodeEvents(on, config) {
      config.env = {
        ...process.env,
        ...config.env
      }
      on('task', {
        reset: resetStubs,
        // Add all the mock apis below
        ...hmppsAuth,
        ...govukOneLogin,
        ...psfrApi,
        ...popApi,
      })
      return config
    },
    baseUrl: 'http://localhost:3007',
    excludeSpecPattern: '**/!(*.cy).ts',
    specPattern: 'cypress/specs/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/index.ts',
  },
})
