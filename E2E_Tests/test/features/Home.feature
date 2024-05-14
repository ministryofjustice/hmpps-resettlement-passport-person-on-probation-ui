Feature: Home

  @test
  Scenario: Home: user can register
    Given the user has access to their first-time ID code
    When the user visit plan your future
    Then they create an account with Gov One Login
    Then the user completes the account setup with first-time ID code
    Then the user deletes their Gov One Account