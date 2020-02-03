Feature: Create space form
  
  Scenario: Creating a space
    When I save a space
    Then the created space should be persisted
    And create space drawer should be closed

  Scenario: Creating a space with a reminder note
    When I save a space with a reminder note
    Then the created space should be persisted with a reminder note

  Scenario: Check create space form validation messages list
    When I enter no data on space form and click submit button
    Then validation messages list for space form should be shown at the bottom
    And validation message should be available for each invalid field of space form

  Scenario: Creating a space and add asset
    When I click "create a space and add asset"
    Then the created space should be added to the table