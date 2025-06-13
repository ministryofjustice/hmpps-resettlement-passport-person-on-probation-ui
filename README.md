# hmpps-resettlement-passport-person-on-probation-ui
[![repo standards badge](https://img.shields.io/badge/dynamic/json?color=blue&style=flat&logo=github&label=MoJ%20Compliant&query=%24.result&url=https%3A%2F%2Foperations-engineering-reports.cloud-platform.service.justice.gov.uk%2Fapi%2Fv1%2Fcompliant_public_repositories%2Fhmpps-resettlement-passport-person-on-probation-ui)](https://operations-engineering-reports.cloud-platform.service.justice.gov.uk/public-github-repositories.html#hmpps-resettlement-passport-person-on-probation-ui "Link to report")
[![CircleCI](https://circleci.com/gh/ministryofjustice/hmpps-resettlement-passport-person-on-probation-ui/tree/main.svg?style=svg)](https://circleci.com/gh/ministryofjustice/hmpps-resettlement-passport-person-on-probation-ui)

Template github repo used for new Typescript based projects.

## Requirements

* Node 20
* Docker
* kubectl

## Dev setup

* Install dependencies using `npm install`, ensuring you are using node 20 (if using `nvm` run `nvm use`)
* Create a `.env` file at the root of the project and copy the contents from `.env.example` into it
* Populate all the redacted variables in `.env` using the matching values from the kubernetes dev environment

You can get these variables from kubernetes by running:

`kubectl -n hmpps-resettlement-passport-dev get secrets <name> -o json | jq '.data | map_values(@base64d)'`

e.g.:

`kubectl -n hmpps-resettlement-passport-dev get secrets govuk-one-login -o json | jq '.data | map_values(@base64d)'`

**Important**: You must replace \n with a line break for the PRIVATE and PUBLIC keys

## Running locally
Run `./dev`

## Testing

### Run tests

`npm run test`

### Running integration tests

Run: `./int-test`

Integration tests (Cypress) instructions [here](./integration_tests/README.md)

### Performance tests

Performance tests (k6) instructions [here](./pt_tests/README.md)

## Other useful commands

### Run linter

`npm run lint`

### Run prettier format

`npm run format`

### Run required deps upgrade check

`npm run outdated-required`

## Change log

A changelog for the service is available [here](./CHANGELOG.md)

## Dependency Checks

The template project has implemented some scheduled checks to ensure that key dependencies are kept up to date.
If these are not desired in the cloned project, remove references to `check_outdated` job from `.circleci/config.yml`


## Azure App insights Metrics

We have the ability to track user events, through Azure App insights. For example by adding a tag to anchors or buttons like so:
`<a href="#" track-tag-id="testBtn" track-event-name="ServiceStart">Temp</a>`
this will generate a  `PYF_ServiceStart` event with properties `[{ type: 'A', identifier: 'testBtn' }]`.
We can also track other type of events if we wish to, for example events where Errors are displayed to users or, failed number of login attempts, etc.

Go to Azure App Insights >> nomis prod or nomis preprod >> Usage >> Events 

Then click 'View More Insights' for the last 30 minutes (for example).

Scroll to EVENT STATISTICS and filter by name, enter 'PYF' enter and you should see some results.


## Feature flags

This app makes use of feature flags stored in an S3 bucket. It can default to a local file by setting the environment variable `FEATURE_FLAG_ENABLED="false"`, which will use the local file `localstack/flags.json` so you can test turning features on or off locally.

There is another file called `integration_tests/flags.restore.json`, which is used by integration tests to change and restore the flag values for testing. For example, you can change the appointments feature flag and test the service with the flag turned on or off.

To amend flags in the S3 bucket, make use of the `k_exec_cp` utility. You can set this in you `.bashrc` or `.zshrc`

```bash
function k_exec_cp() {
  echo "##### You are on $(kubectl config view --minify -o jsonpath='{..namespace}' | sed "s/.*-//") #####"
  echo "Useful commands:"
  echo "aws s3 cp s3://$(kubectl get secret s3-bucket-output -o jsonpath='{.data.bucket_name}' | base64 --decode)/feature-flags/flags.json flags.json"
  echo "aws s3 cp flags.json s3://$(kubectl get secret s3-bucket-output -o jsonpath='{.data.bucket_name}' | base64 --decode)/feature-flags/flags.json"
  PODNAME=$(kubectl get pods | grep "cloud-platform-" | cut -d " " -f1 2>&1)
  kubectl exec --stdin --tty ${PODNAME} -- /bin/sh -c "cd /tmp && /bin/sh"
}
```

## One login

If the one login credentials are ever lost, you can re-enroll the service here https://admin.sign-in.service.gov.uk

And recreate the secret in the k8s namespace:

```bash
kubectl -n hmpps-resettlement-passport-<env> create secret generic govuk-one-login --from-file=GOVUK_ONE_LOGIN_CLIENT_ID=client-id.txt --from-file=GOVUK_ONE_LOGIN_PRIVATE_KEY=private_key.pem --from-file=GOVUK_ONE_LOGIN_PUBLIC_KEY=public_key.pem 
```