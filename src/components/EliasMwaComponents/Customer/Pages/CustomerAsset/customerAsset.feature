Feature: Customer MyState Assets Page

  Scenario: Checking Breadcrumb
    When I go to my estate asset page
    Then the breadcrumb should be correct

  Scenario: Assets table filter
    When I choose Virtual for filter option
    Then only virtual assets should be listed

  Scenario: Assets table sort
    When I choose Qty Ascending for sort option
    Then assets list should be sorted
