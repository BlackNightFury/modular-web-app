Feature: Show presurveyor questionnaiers

  Scenario: Pre survey questionnaire of facility
    Given I am seeing pre survey questionnaire
    Then continue button should be disabled
    When I complete the pre survey questionnaire
    Then continue button should be enabled