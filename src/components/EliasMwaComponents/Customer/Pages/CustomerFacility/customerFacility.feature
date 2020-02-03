Feature: Customer MyEstate Facilities Page

  Scenario: Checking Breadcrumb
    When I go to the facilities page
    Then the facilities breadcrumb should be shown

  Scenario: Facilities table filter
    When I filter on not started
    Then the facilities list should be filtered by not started

  Scenario: Facilities table sort
    When I sort by assets
    Then the facilities list should be sorted by assets
