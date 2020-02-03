Feature: LifeCycle and Replacement Costs Dashboard Page

  Background:
    Given I’m logged in as a customer
    And a selection of assets exist

  Scenario: Navigation
    When I navigate to the lifecycle and replacement costs dashboard
    Then dashboard view should be shown
    And Asset replacement cost by priority chart should have data
    When I set asset type filter
    Then Asset replacement cost by priority chart should be filtered

  Scenario: Toggles to the listing, and asserts
    When I navigate to the lifecycle and replacement costs dashboard
    And I switch to the table view
    Then the data table should be correct
    When I close the context panel
    Then it should be still table view

  Scenario: Filter and asserts
    When I navigate to the lifecycle and replacement costs dashboard
    And I set asset type filter
    Then filter should be applied correctly
    When I set date range filter
    Then filter should be applied correctly
