Feature: Facility Completion

  Scenario: Complete facility
    When I navigate to the completion page
    Then the complete button should be disabled
    When I complete the form
    Then the complete button should be enabled
    When I submit the form
    Then I should be taken to my work