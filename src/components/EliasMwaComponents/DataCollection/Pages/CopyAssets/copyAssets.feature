Feature: Copy Assets

  Scenario: Copy Virtual Assets
    When I navigate to the copy assets page
    Then the complete copy button should be disabled
    When I open the virtul asset edit drawer
    Then the virtual assets fields should be editable