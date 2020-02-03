Feature: Check Facility

  Background:
    Given a facility exists
    Given I’m logged in as a surveyor

  Scenario: View / edit facility
    When I select the facility
    Then the facility edit screen should be readonly
    And there should be PSQ warning card

    When I complete the pre survey questionnaire
    And I select the facility
    Then the facility edit screen should not be readonly

  Scenario: Checking CardView
    When I switch to card view
    Then the facility cardview should be displayed
