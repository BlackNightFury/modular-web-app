Feature: Check Floor

  Background:
    Given a floor exists
    And I’m logged in as a surveyor

  Scenario: Checking CardView
    Given I've navigated to the facility page
    When I switch to card view
    Then the floor cardview should be displayed

  Scenario: Delete a floor
    Given I've navigated to the facility page
    When I try to delete a floor
    Then delete floor warning message appears
    When I continue delete
    Then The floor should disappear in the table