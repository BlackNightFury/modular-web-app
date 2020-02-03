Feature: Menu Left Drawer

  Scenario: Client Context Panel
    When I log in as customer
    Then I should see the client context panel

  Scenario: Surveyor Context Panel
    When I log in as surveyor
    Then I should see myestate assets page panel
    When I click myestate assets page panel
    Then I should be taken to myestate assets page
