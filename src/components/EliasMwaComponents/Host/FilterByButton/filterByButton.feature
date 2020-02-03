# Feature: FilterBy button
#   Scenario: Checking FilterBy Actions
#     When assets list view exist with filter option
#     Then the filter icon should be available
#     When I click filter icon
#     Then it should change the expanded status of tree select
#     When I change selection with filter input
#     Then new filter event should be triggered



Feature: FilterBy button
  Scenario: Displays correctly
    Given an assets list with filter option
    When the filter renders
    Then the filter icon should be available

  Scenario: Expand tree
    Given an assets list with filter option
    When the filter renders
    And I click filter icon
    Then it should change the expanded status of tree select

  Scenario: Trigger event
    Given an assets list with filter option
    When the filter renders
    And I click filter icon
    And I change selection with filter input
    Then new filter event should be triggered

  Scenario: Multiple filters
    Given an assets list with filter option
    When the filter renders
    And I click filter icon
    And I change selection with filter input
    And I add a second filter selection
    Then new filter event should be triggered
    And the filter event should include both filters

  Scenario: Filter by asset class
    Given an assets list with core & virtual assets
    When the filter renders
    Then the filter should include all asset class options

  Scenario: Filter by asset class - only core
    Given an assets list with only core assets
    When the filter renders
    Then the filter should include only core

  Scenario: Filter by asset type
    Given an assets list
    When the filter renders
    Then the filter should only include relevent asset types