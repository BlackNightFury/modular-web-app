Feature: Lifecycle and Replacement Cost Dashboard Page
  Scenario: Lifecycle and Replacement Cost Dashboard Views Check
    Given various types of assets are provided for lifecycle dashboard page
    When I go to lifecycle and replacement cost dashboard page
    Then dashboard view for lifecycle and replacement cost dashboard should be shown
    When I switch to list view on lifecycle dashboard
    Then list view for lifecycle and replacement cost dashboard should be shown
