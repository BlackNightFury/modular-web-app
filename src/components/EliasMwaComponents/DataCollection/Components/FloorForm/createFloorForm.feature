Feature: Create floor form
  
  Scenario: Creating a floor
    When I save a floor
    Then the created floor should be persisted
    And drawer should be closed

  Scenario: Creating a floor with a reminder note
    When I save a floor with a reminder note
    Then the created floor should be persisted with a reminder note

  Scenario: Check create floor form validation messages list
    When I enter no data on floor form and click submit button
    Then validation messages list for floor form should be shown at the bottom
    And validation message should be available for each invalid field of floor form