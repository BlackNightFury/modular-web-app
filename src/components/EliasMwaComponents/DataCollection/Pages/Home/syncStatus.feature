Feature: Sync status

  Scenario: Online
    When I am online
    Then the status should be online

  Scenario: Offline within ok timeout
    When I am offline
    When I have not yet reached the ok timeout
    Then the status should be offline

  Scenario: Offline exceeded ok timeout
    When I am offline
    When I have exceeded the ok timeout
    Then the status should be not synched
    Then the warning card should be shown

  Scenario: Offline exceeded warning timeout
    When I am offline
    When I have exceeded the warning timeout
    Then the status should be data out of date
    Then the error card should be shown
