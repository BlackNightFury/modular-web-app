Feature: Browser Locale based DateTime

  Background:
    Given a facility exists
    Given I’m logged in as a surveyor

  Scenario: en-US based datetime
    When I set browser locale as en-US
    And I refresh the page
    Then all datetime strings should appear based en-US datetime format

  Scenario: en-GB based datetime
    When I set browser locale as en-GB
    And I refresh the page
    Then all datetime strings should appear based en-GB datetime format
