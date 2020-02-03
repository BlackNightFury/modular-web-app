Feature: Assets table

  Scenario: Assets table infinite load button disable
    Given assets count is less than page size
    When the assets table is displayed
    Then more button for assets should be disabled

 Scenario: Assets table infinite load button functionality
   Given assets count is more than page size
   When the assets table is displayed
   Then more button for assets should be enabled
   When I click more button for more assets
   Then it should show more assets

 Scenario: Checking Edit Action
    When the assets table is displayed
    Then the edit button on table item should be available
    When I click edit button
    Then edit event should be triggered

 Scenario: Checking Delete Action
    When I click ellipses dropdown
    Then actions dropdown for the asset should be shown
    When I delete the item
    Then delete event should be triggered

  Scenario: Assets table infinite load button functionality
    Given assets count is more than page size
    When the assets table is displayed
    Then more button for assets should be enabled
    When I click more button for more assets
    Then it should show more assets
