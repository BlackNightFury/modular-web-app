Feature: Spaces table

 Scenario: Space not started
   Given a space is not started
   When the spaces table is displayed
   Then the space status indicator should be not started

 Scenario: Space in progress
   Given a space is in progress
   When the spaces table is displayed
   Then the space status indicator should be in progress

 Scenario: Space done
   Given a space is done
   When the spaces table is displayed
   Then the space status indicator should be done

 Scenario: Space inaccessible
   Given a space is inaccessible
   When the spaces table is displayed
   Then the space status indicator should be inaccessible

 Scenario: Spaces table infinite load button disable
   Given spaces count is less than page size
   When the spaces table is displayed
   Then more button for spaces should be disabled

 Scenario: Spaces table infinite load button functionality
   Given spaces count is more than page size
   When the spaces table is displayed
   Then more button for spaces should be enabled
   When I click more button for more spaces
   Then it should show more spaces
