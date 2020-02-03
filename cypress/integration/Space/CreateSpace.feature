Feature: Create a Space

  Background:
    Given a floor exists
    And I’m logged in as a surveyor
    And I've navigated to the floor page

  Scenario: Creating a space
    When I create a space
    Then the space should appear in the table
    And the space should sync to the database
    And the floor should be shown in the context panel

  Scenario: Creating a space with a reminder note
    When I create a space with a reminder note
    Then the space should appear in the table
    And the space should sync to the database

  Scenario: Creating a space and add asset
    When I use the "create new space and add asset" action
    Then the user should be taken to the space
    And the add asset dialogue should be shown

  Scenario: Create space subscription
    When the space is created by other surveyors
    Then it should appear in the table
