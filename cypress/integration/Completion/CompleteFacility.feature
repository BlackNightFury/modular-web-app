Feature: Complete Facility

  Background:
    Given a facility exists
    And I’m logged in as a surveyor
    
  Scenario: Complete facility from context panel
    Given I've done some work
    When I navigate to the facility
    And I select complete facility from the context panel
    Then I should be taken to the completion page

  Scenario: Complete facility
    Given I've done some work
    When I navigate to my work
    And I select complete facility from my work
    Then I should be taken to the completion page
    And the complete button should be disabled
    When I complete the form
    Then the complete button should be enabled
    When I submit the form
    Then I should be taken to my work
    And the completion should sync to the database
    When the completion is succeeded
    Then I should see the completion global message
    And completion global message should disappear after 5secs

  Scenario: Save progress on complete facility details
    Given I've done some work
    When I navigate to the facility
    And I select complete facility from the context panel
    Then I should be taken to the completion page
    When I save the progress
    And I refresh the page
    Then the complete facility details should be saved

