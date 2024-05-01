# hmpps-resettlement-passport-person-on-probation-ui
[![repo standards badge](https://img.shields.io/badge/dynamic/json?color=blue&style=flat&logo=github&label=MoJ%20Compliant&query=%24.result&url=https%3A%2F%2Foperations-engineering-reports.cloud-platform.service.justice.gov.uk%2Fapi%2Fv1%2Fcompliant_public_repositories%2Fhmpps-resettlement-passport-person-on-probation-ui)](https://operations-engineering-reports.cloud-platform.service.justice.gov.uk/public-github-repositories.html#hmpps-resettlement-passport-person-on-probation-ui "Link to report")
[![CircleCI](https://circleci.com/gh/ministryofjustice/hmpps-resettlement-passport-person-on-probation-ui/tree/main.svg?style=svg)](https://circleci.com/gh/ministryofjustice/hmpps-resettlement-passport-person-on-probation-ui)

Template github repo used for new Typescript based projects.

## Dev setup

Install dependencies using `npm install`, ensuring you are using v20.11.0 (npm v10.4.0)
Note: If using `nvm` run `nvm use`

### One Login credentials
```
GOVUK_ONE_LOGIN_URL=https://oidc.integration.account.gov.uk
GOVUK_ONE_LOGIN_VTR=LOW # LOW will skip the OTP verification during sign-in
GOVUK_ONE_LOGIN_CLIENT_ID="<govuk_one_login_client_id>"
GOVUK_ONE_LOGIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----
<private key contents>
-----END PRIVATE KEY-----"
GOVUK_ONE_LOGIN_PUBLIC_KEY="-----BEGIN PUBLIC KEY-----
<public key contents>
-----END PUBLIC KEY-----"
```

You can grab these values from the namespace like so
`kubectl -n hmpps-resettlement-passport-<env> get secrets govuk-one-login -o json | jq '.data | map_values(@base64d)'`

If the credentials above are lost, you can re-enroll the service here https://admin.sign-in.service.gov.uk
Recreate the secret in the k8s namespace:
`kubectl -n hmpps-resettlement-passport-<env> create secret generic govuk-one-login --from-file=GOVUK_ONE_LOGIN_CLIENT_ID=client-id.txt --from-file=GOVUK_ONE_LOGIN_PRIVATE_KEY=private_key.pem --from-file=GOVUK_ONE_LOGIN_PUBLIC_KEY=public_key.pem`

### ZenDesk credentials
```
ZENDESK_USER
ZENDESK_TOKEN
```
You can grab these values from the namespace like so
`kubectl -n hmpps-resettlement-passport-<env> get secrets zendesk -o json | jq '.data | map_values(@base64d)'`

Set the values with:
`kubectl -n hmpps-resettlement-passport-<env> create secret generic zendesk --from-literal=ZENDESK_USER=<user>  --from-literal=ZENDESK_TOKEN=<token>`


### Running the app for development
To start the main services excluding the example typescript template app: 

`docker compose up -d`

And then, to build the assets and start the app with nodemon:

`npm run start:dev`

=> Simplified script: `./dev`

### Run linter

`npm run lint`

### Run prettier format

`npm run format`

### Run tests

`npm run test`

### Running integration tests

For local running, start a test db and wiremock instance by:

`docker compose -f docker-compose-test.yml up`

Then run the server in test mode by:

`npm run start-feature` (or `npm run start-feature:dev` to run with nodemon)

And then either, run tests in headless mode with:

`npm run int-test`
 
Or run tests with the cypress UI:

`npm run int-test-ui`

=> Simplified script: `./int-test`

Integration tests (Cypress) instructions [here](./integration_tests/README.md)

## Performance tests

Performance tests (k6) instructions [here](./pt_tests/README.md)

## Change log

A changelog for the service is available [here](./CHANGELOG.md)

## Dependency Checks

The template project has implemented some scheduled checks to ensure that key dependencies are kept up to date.
If these are not desired in the cloned project, remove references to `check_outdated` job from `.circleci/config.yml`
