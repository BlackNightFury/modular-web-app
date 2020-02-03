Feature: Assets table

  Scenario: Assets table infinite load button disable
    Given asset list count is less than page size
    When the Asset Management List is displayed
    Then more button for asset list should be disabled

  Scenario: Assets table infinite load button functionality
    Given asset list count is more than page size
    When the Asset Management List is displayed
    Then more button for asset list should be enabled
    When I click more button
    Then more assets should be shown

  Scenario: Checking Edit Action
    When I click ellipses dropdown menu
    Then dropdown menu for the asset should be shown
    When I edit the item
    Then the edit event should be triggered
    