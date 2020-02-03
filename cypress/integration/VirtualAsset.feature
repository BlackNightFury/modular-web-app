Feature: Create and Update a Virtual Asset

  Scenario: Creating a virtual asset
    Given a floor exists
    Given I’m logged in as a surveyor
    Given I've navigated to the virtual asset page
    When I create a virtual asset
    Then the asset should appear in the table
    Then the asset should sync to the database

  Scenario: Updating a virtual asset
    Given a virtual asset exists
    Given I’m logged in as a surveyor
    Given I've navigated to the virtual asset page
    When I update the quantity of the virtual asset
    Then the update should appear in the table
    Then the update should sync to the database

  Scenario: Adding duplicate virtual asset
    Given a virtual asset exists
    Given I’m logged in as a surveyor
    Given I've navigated to the virtual asset page
    When I add the same virtual asset
    Then a new virtual asset should not be created
    And the existing virtual asset should be updated
  
  Scenario: Checking CardView
    Given a virtual asset exists
    Given I’m logged in as a surveyor
    Given I've navigated to the virtual asset page
    When I switch to card view
    Then the asset cardview should be displayed