Feature: Customer MyEstate Facilities

  Background:
    Given I’m logged in as a customer

  Scenario: Navigation
    When I navigate to the facilities page
    Then I should see facilities table
