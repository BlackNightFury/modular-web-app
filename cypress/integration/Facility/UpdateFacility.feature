Feature: Update Facility

  Background:
    Given a facility exists
    Given I’m logged in as a surveyor

  Scenario: Edit Facility Action
    When I click the multi action button
    Then the actions list should be shown
    When I update the facility info
    Then the update should appear in the table
    And the update should sync to the database
  Scenario: Edit Facility From Facility Page
    When I navigate to the facility
    And I click the edit facility
    Then the edit facility drawer should be shown
