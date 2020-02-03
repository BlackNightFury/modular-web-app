Feature: Untagged Assets Page

  Scenario: Checking Breadcrumb
    When I go to untagged assets page
    Then the untagged assets breadcrumb should be shown

  Scenario: Untagged Assets table filter
    When I filter on Chilled Beams
    Then the untagged assets list should be filtered by Chilled Beams

  Scenario: Untagged Assets table sort
    When I sort by Qty
    Then the untagged assets list should be sorted by Qty
