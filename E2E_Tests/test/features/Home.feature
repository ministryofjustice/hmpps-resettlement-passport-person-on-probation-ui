Feature: Home

@test
  Scenario Outline: 1-5) User Housekeeping if failure of tests
    Given the user has access to their first-time ID code
    Given the user visit plan your future
    Then delete account housekeeping email <gmail>

   Examples:
    | gmail            | 
    | "+140@gmail.com" |
    | "+141@gmail.com" |
    | "+142@gmail.com" |
    | "+143@gmail.com" |
    | "+144@gmail.com" |


@test
  Scenario: 6) Full E2E registration Gov One then completed PYF then delete account
    Given the user has access to their first-time ID code
    When the user visit plan your future
    Then they create an account with Gov One Login email "+140@gmail.com"
    Then the user completes the account setup with first-time ID code
    Then the user deletes their Gov One Account

@test
  Scenario: 7) User registration to Gov One, then logs out, then logs back into complete registration then deletes account
    Given the user has access to their first-time ID code
    Given the user visit plan your future
    Then they create an account with Gov One Login email "+141@gmail.com"
    Then the user Logs Out of the service
    Then the user logs into their account who has not completed account setup email "+141@gmail.com"
    Then the user completes the account setup with first-time ID code
    Then the user deletes their Gov One Account after logging in

@test
  Scenario: 8) User registration to Gov One, then completes PYF then logs out, then logs back into PYF then deletes account
    Given the user has access to their first-time ID code
    Given the user visit plan your future
    Then they create an account with Gov One Login email "+142@gmail.com"
    Then the user completes the account setup with first-time ID code
    Then the user Logs Out of the service
    Then the user logs into their account who has completed account setup email "+142@gmail.com"
    Then the user deletes their Gov One Account after logging in

@test
  Scenario: 9) User registration to Gov One, then completes PYF then logs out, then tries to re-register with Gov One
    Given the user has access to their first-time ID code
    Given the user visit plan your future
    Then they create an account with Gov One Login email "+143@gmail.com"
    Then the user completes the account setup with first-time ID code
    Then the user Logs Out of the service
    Then they try to re-create an existing account with Gov One Login email "+143@gmail.com"
    Then the user deletes their Gov One Account after logging in

@test
  Scenario: 10) Full E2E registration Gov One then completed PYF then delete account tries to register with same OTP NOMIS ID, requests new OTP to complete registration
    Given the user has access to their first-time ID code
    When the user visit plan your future
    Then they create an account with Gov One Login email "+144@gmail.com"
    Then the user completes the account setup with first-time ID code
    Then the user deletes their Gov One Account
    Then the user revisits plan your future
    Then the user will be still logged into current session so Logs Out of the service
    Then they create an account with Gov One Login email "+144@gmail.com"
    Then the user completes the account setup with expired first-time ID code
    Then the user Logs Out of the service
    Then the user requests for their first-time ID code
    Then the user revisits plan your future
    Then the user logs into their account who has not completed account setup email "+144@gmail.com"
    Then the user completes the account setup with first-time ID code
    Then the user deletes their Gov One Account after logging in

@ignore
  Scenario: 11) User logs into PYF in pre-existing account (only used for troubleshooting)
    Given the user visit plan your future
    Then the user logs into their account who has completed account setup email "+1@gmail.com"
    Then the user Logs Out of the service

@pdf
  Scenario: 11) User logs into PYF in pre-existing account (only used for troubleshooting)
    Given the user visit plan your future
    Then the user logs into their account who has completed account setup email "+4@gmail.com"
    Then the user views their Licence Conditions PDF
    Then the user Logs Out of the service




  