
Feature: Complete Facility Readonly

  Background:
    Given an asset exists
    And I’m logged in as a surveyor

  Scenario: Should not be able to edit after completion
    When I complete the facility
    Then the facility should be readonly
    And I should be able to select a floor
    And the floor should be readonly
    And I should be able to select a space
    And the space should be readonly
    And I should be able to select an asset
    And the asset should be readonly
