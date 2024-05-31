Feature: Home


@test
  Scenario: User Housekeeping if failure of tests
    Given the user has access to their first-time ID code
    Given the user visit plan your future
    Then delete account housekeeping
    

@test
  Scenario: Full E2E registration Gov One then completed PYF then delete account
    Given the user has access to their first-time ID code
    When the user visit plan your future
    Then they create an account with Gov One Login
    Then the user completes the account setup with first-time ID code
    Then the user deletes their Gov One Account


@test
  Scenario: User registration to Gov One, then logs out, then logs back into complete registration then deletes account
    Given the user has access to their first-time ID code
    Given the user visit plan your future
    Then they create an account with Gov One Login
    Then the user Logs Out of the service
    Then the user logs into their account who has not completed account setup
    Then the user completes the account setup with first-time ID code
    Then the user deletes their Gov One Account after logging in


 @test
  Scenario: User registration to Gov One, then completes PYF then logs out, then logs back into PYF then deletes account
    Given the user has access to their first-time ID code
    Given the user visit plan your future
    Then they create an account with Gov One Login
    Then the user completes the account setup with first-time ID code
    Then the user Logs Out of the service
    Then the user logs into their account who has completed account setup
    Then the user deletes their Gov One Account after logging in


@test
  Scenario: User registration to Gov One, then completes PYF then logs out, then tries to re-register with Gov One
    Given the user has access to their first-time ID code
    Given the user visit plan your future
    Then they create an account with Gov One Login
    Then the user completes the account setup with first-time ID code
    Then the user Logs Out of the service
    Then they try to re-create an existing account with Gov One Login
    Then the user deletes their Gov One Account after logging in


@test
  Scenario: Full E2E registration Gov One then completed PYF then delete account tries to register with same OTP NOMIS ID, requests new OTP to complete registration
    Given the user has access to their first-time ID code
    When the user visit plan your future
    Then they create an account with Gov One Login
    Then the user completes the account setup with first-time ID code
    Then the user deletes their Gov One Account
    Then the user revisits plan your future
    Then the user will be still logged into current session so Logs Out of the service
    Then they create an account with Gov One Login
    Then the user completes the account setup with expired first-time ID code
    Then the user Logs Out of the service
    Then the user requests for their first-time ID code
    Then the user revisits plan your future
    Then the user logs into their account who has not completed account setup
    Then the user completes the account setup with first-time ID code
    Then the user deletes their Gov One Account after logging in



  