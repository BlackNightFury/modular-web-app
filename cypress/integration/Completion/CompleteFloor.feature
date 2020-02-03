Feature: Complete Floor

  Scenario: Complete a floor
    Given a space exists
    And I’m logged in as a surveyor
    And I've navigated to the facility page
    When I start the complete floor process
    Then the floor completion drawer should be shown
    When I update the space status to done
    And I submit the complete floor form
    Then the done floor should appear in the table

  Scenario: Complete a floor from context panel
    Given a space exists
    And I’m logged in as a surveyor
    And I've navigated to the floor page
    When I complete a floor in context panel
    Then I should be taken to the facility page
    And the done floor should appear in the table