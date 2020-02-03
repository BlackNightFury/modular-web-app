Feature: Check other space features

  Background:
    Given a space exists
    And I’m logged in as a surveyor

  Scenario: Checking CardView
    Given I've navigated to the floor page
    When I switch to card view
    Then the cardview should be displayed
  
  Scenario: Favourite a space
    When I've navigated to the floor page
    Then the floor should be shown in the context panel
    When I favourite a space
    Then the floor should be shown in the context panel
    And the favourite space should be present in my favourites
    When I navigate back to the facility page
    Then the facility should be shown in the context panel

  Scenario: Delete a space
    When I've navigated to the floor page
    And I try to delete a space
    Then delete space warning message appears
    When I continue delete
    Then The space should disappear in the table

  Scenario: Using the context panel on space page
    Given I've navigated to the floor page
    And I open the my work module
    When I favourite a space
    Then my work module should remain open
    When I navigate to the home page
    And I navigate to the facility page
    Then my work module should remain open