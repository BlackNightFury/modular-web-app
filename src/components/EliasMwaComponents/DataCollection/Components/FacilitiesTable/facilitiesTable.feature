Feature: Facilities table

 Scenario: Facility not started
   Given a facility is not started
   When the facilities table is displayed
   Then the facility status indicator should be not started

 Scenario: Facility in progress
   Given a facility is in progress
   When the facilities table is displayed
   Then the facility status indicator should be in progress

 Scenario: Facility done
   Given a facility is done
   When the facilities table is displayed
   Then the facility status indicator should be done

 Scenario: Facility inaccessible
   Given a facility is inaccessible
   When the facilities table is displayed
   Then the facility status indicator should be inaccessible
 Scenario: Facilities table infinite load button disable
   Given facilities count is less than page size
   When the facilities table is displayed
   Then more button for facilities should be disabled

 Scenario: Facilities table infinite load button functionality
   Given facilities count is more than page size
   When the facilities table is displayed
   Then more button for facilities should be enabled
   When I click more button for more facilities
   Then it should show more facilities
