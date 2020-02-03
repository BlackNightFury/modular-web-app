Feature: Update a Space
  Background:
    Given a space exists
    And I’m logged in as a surveyor
    And I've navigated to the floor page


  Scenario: Update space subscription
    When the space is updated by other surveyors
    Then it should appear in the table
