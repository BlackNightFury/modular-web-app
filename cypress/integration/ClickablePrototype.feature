Feature: Create and Update an Asset

  Scenario: Creating an asset
    Given I’m logged in as a surveyor
    And I’ve navigated to the space page
    When I create an asset
    Then the asset should appear in the table

  Scenario: Asset Replacement Cost Navigation
    Given I’m logged in as a customer
    When I navigate to the asset replacement cost dashboard
    Then I should see facilities table