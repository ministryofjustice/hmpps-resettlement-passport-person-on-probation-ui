Feature: Home

@test
  Scenario Outline: 1-3) User Housekeeping if failure of tests
    Given the user has access to their first-time ID code
    Given the user visit plan your future
    Then delete account housekeeping email <gmail>

   Examples:
    | gmail            | 
    | "+130@gmail.com" |
    | "+131@gmail.com" |
    | "+132@gmail.com" |

@test
  Scenario: 4) Full E2E registration Gov One then completed PYF then delete account
    Given the user has access to their first-time ID code
    When the user visit plan your future
    Then they create an account with Gov One Login email "+130@gmail.com"
    Then the user completes the account setup with first-time ID code
    Then the user deletes their Gov One Account

@test
  Scenario: 5) User registration to Gov One, then completes PYF then logs out, then logs back into PYF then deletes account
    Given the user has access to their first-time ID code
    Given the user visit plan your future
    Then they create an account with Gov One Login email "+131@gmail.com"
    Then the user completes the account setup with first-time ID code
    Then the user Logs Out of the service
    Then the user logs into their account who has completed account setup email "+131@gmail.com"
    Then the user deletes their Gov One Account after logging in

@test
  Scenario: 6) Full E2E registration Gov One then completed PYF then delete account tries to register with same OTP NOMIS ID, requests new OTP to complete registration
    Given the user has access to their first-time ID code
    When the user visit plan your future
    Then they create an account with Gov One Login email "+132@gmail.com"
    Then the user completes the account setup with first-time ID code
    Then the user deletes their Gov One Account
    Then the user revisits plan your future
    Then the user will be still logged into current session so Logs Out of the service
    Then they create an account with Gov One Login email "+132@gmail.com"
    Then the user completes the account setup with expired first-time ID code
    Then the user Logs Out of the service
    Then the user requests for their first-time ID code
    Then the user revisits plan your future
    Then the user logs into their account who has not completed account setup email "+132@gmail.com"
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




  