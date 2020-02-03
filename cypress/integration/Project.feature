Feature: Project

  Background:
    Given an asset exists
    Given I’m logged in as a surveyor

  Scenario: Set site to readonly after completion
    Given I've done some work
    When I complete the site
    Then the site should be readonly

  Scenario: Check project docs available
    When I click the project docs link
    Then the pdf should be shown
