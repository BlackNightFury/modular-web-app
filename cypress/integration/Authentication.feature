Feature: Authentication

  Scenario: Check table styles
    When I'm logged in as a user
    Then I should be redirected to surveyor home page
    And the tables should have proper styles

  Scenario: Log in as surveyor
    When I'm logged in as a surveyor
    Then I should be redirected to surveyor home page

  Scenario: Log in as customer
    When I'm logged in as a customer
    Then I should be redirected to customer home page

  Scenario: Log out and check localstorage
    Given a facility exists
    Given I’m logged in as a surveyor
    Given I've navigated to the facility page
    Given I've done some work
    When I log out
    Then local storage should be empty
