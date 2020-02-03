Feature: Update Floor
  Background:
    Given a floor exists
    And I’m logged in as a surveyor
    And I've navigated to the facility page

  Scenario: Updating a floor
    When I update a floor
    Then the update should appear in the table
    Then the update should sync to the database

  Scenario: Update floor subscription
    When the floor is updated by other surveyors
    Then it should appear in the table
