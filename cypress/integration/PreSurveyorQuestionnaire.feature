Feature: Show presurveyor questionnaiers

  Background:
    Given a floor exists
    Given I’m logged in as a surveyor

  Scenario: Pre survey questionnaire of facility
    When I navigate to the facility
    Then the facility pre survey questionnaire should be displayed
    And the facility should be readonly

    When I complete the pre survey questionnaire
    Then the pre survey questionnaire should sync to the database
    And the facility should not be readonly

    When I return to the homepage
    And I navigate to the facility
    Then the facility should not be readonly
    And the facility pre survey questionnaire should not display
