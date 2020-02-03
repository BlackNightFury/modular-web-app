Feature: Virtual Assets at space level

  Background:
    Given I’m logged in as a surveyor
    
  Scenario: Attempt to navigate to floor virtual assets
    When I navigate to a facility
    And I create a floor
    Then the virtual asset link should not be available on the floor
    And I cannot navigate to the virtual assets screen
    
  Scenario: Creating a virtual asset
    Given I've navigated to the space page
    When I create a virtual asset
    Then the asset should appear in the table
    Then the asset should sync to the database

  Scenario: Updating a virtual asset
    Given I've navigated to the space page
    And a virtual asset exists
    When I update the quantity of the virtual asset
    Then the update should appear in the table
    Then the update should sync to the database

  Scenario: Adding duplicate virtual asset
    Given I've navigated to the space page
    And a virtual asset exists
    When I add the same virtual asset
    Then a new virtual asset should not be created
    And the existing virtual asset should be updated
  
  Scenario: Checking CardView
    Given I've navigated to the space page
    And a virtual asset exists
    When I switch to card view
    Then the asset cardview should be displayed