Feature: Asset Management Dashboard Page
  Scenario: Asset Management Dashboard Views Check
    Given various types of assets are provided
    When I go to asset management dashboard page
    Then dashboard view for asset management dashboard should be shown
    When I switch to list view
    Then list view for asset management dashboard should be shown

  Scenario: Download export
    Given various types of assets are provided
    When I go to asset management dashboard page
    When I click CAFM export
    Then I should be able to see info card
    When the export is generated
    Then I should be able to see success card
