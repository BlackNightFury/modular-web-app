Feature: Logout feature
  Scenario: Logout confirm modal
    Given Unsynced data is available
    When I click logout
    Then it should show logout confirm modal
    When I confirm checkbox and click logout and delete data
    Then local storage should be empty
  
  Scenario: Check Profile Panel
    When I click profile button
    Then it should show correct user data
