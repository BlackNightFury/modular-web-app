Feature: Virtual Assets Page

  Scenario: Virtual Assets Card View Check
    Given two virtual assets exist
    When I switch to the card view
    And I increase the virtual asset quantity
    Then It should be ordered correctly
