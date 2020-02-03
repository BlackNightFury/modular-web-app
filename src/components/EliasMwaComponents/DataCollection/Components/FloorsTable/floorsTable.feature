Feature: Floors table

 Scenario: Floor not started
   Given a floor is not started
   When the floors table is displayed
   Then the status indicator should be not started

 Scenario: Floor in progress
   Given a floor is in progress
   When the floors table is displayed
   Then status indicator should be in progress

 Scenario: Floor done
   Given a floor is done
   When the floors table is displayed
   Then status indicator should be done

 Scenario: Floor inaccessible
   Given a floor has an inaccessible space
   When the floors table is displayed
   Then status indicator should be inaccessible
 
 Scenario: Complete floor
   Given a floor has been started
   When multi actions display
   Then the complete option should be available


 Scenario: Shouldn't be able to complete a completed floor
   Given a floor has been completed
   When multi actions display
   Then the complete option should not be available

 Scenario: Floors table infinite load button disable
   Given floors count is less than page size
   When the floors table is displayed
   Then more button for floors should be disabled

 Scenario: Floors table infinite load button functionality
   Given floors count is more than page size
   When the floors table is displayed
   Then more button for floors should be enabled
   When I click more button for more floors
   Then it should show more floors