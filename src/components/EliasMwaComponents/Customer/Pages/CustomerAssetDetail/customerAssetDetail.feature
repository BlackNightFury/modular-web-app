Feature: Customer Asset Details Page

  Scenario: Checking rating
    When I select asset with rating
    Then I should be able to see rating
    When I select asset without rating
    Then I should be able to see - as rating
