Feature: Complete floor

  Scenario: Space is inaccessible
    Given an inaccessible space is created
    When I complete the floor
    Then I should be prompted with inaccessible warning

  Scenario: Space is not complete #(in progress or not started)
    Given a floor is created with an incomplete space
    When I complete the floor
    Then I should be prompted with not done spaces warning

  Scenario: Mandatory assets not created
    Given a floor is created without mandatory assets
    When I complete the floor
    Then I should be prompted with compulsory assets warning

  Scenario: All mandatory assets present and spaces complete
    Given a complete space is created and mandatory assets are present
    When I complete the floor
    Then I should not be prompted with a warning
    When I accept the checkbox and submit
    And the floor should be complete

  Scenario: Confirm with issues present
    Given a floor is created with an incomplete space
    When I complete the floor
    Then I should be prompted with a warning
    When I accept the warnings and submit
    Then the floor should be complete