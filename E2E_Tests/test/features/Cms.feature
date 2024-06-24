Feature: Content management system tests


@cms
  Scenario: 1) User views CMS content
    Given the user visit plan your future
    Then the user views all content as listed in contents and scans page accessibility for each page
