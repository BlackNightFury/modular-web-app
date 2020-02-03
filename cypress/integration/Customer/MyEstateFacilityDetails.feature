Feature: Customer MyEstate Facility Details

  Background:
    Given a facility exists
    Given I’m logged in as a customer

  Scenario: Checking Customer MyEstate Facility Details
    When I navigate to the facility details page
    Then the faciltiy details should be shown
