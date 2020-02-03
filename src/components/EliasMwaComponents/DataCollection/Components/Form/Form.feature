Feature: FormBuilder validation
  Scenario: Check form validation messages list
    Given form schema with required fields provided
    When form is rendered and I click submit button
    Then validation messages list should be shown at the bottom
    And validation message should be available for each invalid field of formbuilder
