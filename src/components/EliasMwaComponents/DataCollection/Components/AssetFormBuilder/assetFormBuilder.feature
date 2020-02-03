Feature: Asset Form

  Scenario: Checking re-validation
    Given an asset form with asset details
    When the condition is changed to CX
    And the form is submitted
    Then the photo validation error should be shown
    When the condition is changed to B
    Then the photo validation error should not be shown
    When the condition is changed to C
    Then the photo validation error should be shown
    When the Image Restricted is checked
    Then the photo validation error should not be shown
    And the ImageNote validation error should be shown
    When the ImageNote is filled
    Then the ImageNote validation error should not be shown
