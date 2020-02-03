Feature: Create Floor
  Background:
    Given a facility exists
    And I’m logged in as a surveyor
    And I've navigated to the facility page

  Scenario: Creating a floor
    When I create a floor
    Then the floor should appear in the table
    Then the floor should sync to the database

  Scenario: Creating a floor with a reminder note
    When I create a floor with a reminder note
    Then the floor should appear in the table
    Then the floor should sync to the database

  Scenario: Creating a floor with slashes in name
    When I create a floor with slashes in name
    Then the floor with slash in name should appear in the table
    Then clicking the floor should show floor page

  Scenario: Create floor subscription
    When the floor is created by other surveyors
    Then it should appear in the table
