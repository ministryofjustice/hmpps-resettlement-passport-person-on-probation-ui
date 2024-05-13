# E2E tests

## Introduction:

This is a Cucumber BDD Typescript Project using Playwright.  

- HMPPS Resettlement Passport Person on Probation UI (Plan Your Future)

## Pre-Requisites:

- Ensure you have node.js installed on your machine. This can be gotten from the self service
- Make sure npm is also installed on your machine.
- You will need a DPS account for the tests to run on a local machine as the username and password will be required to access the dev HMPPS UI site.
- Install playwright with 'npx playwright install'


## General project structure

| Location         | Usage                                                                                   |
|------------------|-----------------------------------------------------------------------------------------|
| /hooks/hooks.ts  | Contains helper files for pre-test and post test execution conditions                   |                                 
| /hooks/pageFixtures.ts | This is the global location of the page driver                                          |
| /pageObjects     | Page Object files                                                                       |
| /test/features   | BDD feature files                                                                       |
| /test/steps      | Contains the step definition files                                                      |
| Cucumber.json    | Maps the feature files to the step definition files. This is the heart of the framework | 
| Package.json     | Contains dependencies and run conditions                                                | 


## How to run the tests

- Clone the repo (To your documents folder)
- Create a .env file in th root folder (see .env-example.text) with the following information
     - BASEURL = https://person-on-probation-user-ui-dev.hmpps.service.justice.gov.uk/
     - PSFRURL = https://resettlement-passport-ui-dev.hmpps.service.justice.gov.uk/
     - USERNAME = DPS Username
     - PASSWORD = DPS Password
- Install Dependencies : npm i 
- Run Tests : npm run end-to-end-test
