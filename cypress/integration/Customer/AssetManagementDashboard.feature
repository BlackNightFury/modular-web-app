Feature: Asset Management Dashboard Page

  Background:
    Given I’m logged in as a customer
    And a selection of assets exist
    
  Scenario: Navigation
    When I navigate to the asset management dashboard
    Then the assets by condition and facility chart should have data

  Scenario: Toggles to the listing, and asserts
    When I navigate to the asset management dashboard
    And I switch to the table view
    Then the data table should be correct
    When I close the context panel
    Then it should be still table view

  Scenario: Assets by system and type chart
    When I navigate to the asset management dashboard
    Then assets by system and type chart should have data
    And I set the filter
    Then assets by system and type chart should be filtered

  Scenario: Filter Condition and facility chart
    When I navigate to the asset management dashboard
    And I set the filter
    Then the assets by condition and facility chart should be filtered