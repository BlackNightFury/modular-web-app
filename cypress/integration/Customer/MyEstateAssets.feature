Feature: Customer MyEstate Assets

  Background:
    Given I’m logged in as a customer

  Scenario: Navigation
    When I navigate to the assets page
    Then I should see assets table
