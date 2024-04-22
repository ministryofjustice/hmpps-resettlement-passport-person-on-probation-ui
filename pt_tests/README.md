# hmpps-resettlement-passport-person-on-probation-ui performance tests
To run locally first install k6
`brew install k6`

To run the tests headless you will need chromium installed - to install chromium run
`brew install --force chromium --no-quarantine ` 

# Configure the tests
The tests are controlled to run by adding environment variables to execute the various scenarios. These can be configured in the run.js file. Each scenario has a specific runtime k6 executor based on the load model. 

The available runtime scenarios are:
 
 BROWSER TESTS
 * smoke
 * load
 * stress
 * soak

 API TEST
 * apiSmoke
 * api

 ** note ** 
 The API tests require an Authorization header to be added at runtime. This can be configued as an ENVIRONMENT VARIABLE depending on the environment:

* Dev = DEV_AUTH
* PreProd = PRE_PROD_AUTH

# Running the tests
To run the tests locally these can be executed from the command line in a terminal. 
Navigate to the pt_tests/tests folder
And then, to run the tests execute the following command (replacing EXECUTION_TYPE to your required runtime executor scenario):

FOR API TESTS

`k6 run -e EXECUTION_TYPE=api -e PROCESS=dev -e DEV_AUTH=<devAuthKey> run.js`

`k6 run -e EXECUTION_TYPE=api -e PROCESS=preprod -e PRE_PROD_AUTH=<preProdAuthKey> run.js`

FOR BROWSER TESTS (HEADLESS:TRUE)

`k6 run --no-setup -e EXECUTION_TYPE=smoke run.js`

FOR BROWSER TESTS (HEADLESS:FALSE)

`K6_BROWSER_HEADLESS=false k6 run --no-setup -e EXECUTION_TYPE=smoke run.js`



