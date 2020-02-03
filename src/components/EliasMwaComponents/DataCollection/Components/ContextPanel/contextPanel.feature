Feature: Context Panel

 Scenario: Search Facility
   Given facility with floor and space provided
   And I go to context panel
   When I select a facility on tree menu and click go button
   Then it should navigate to facility page
   When I select a floor on tree menu and click go button
   Then it should navigate to floor page
   When I select a space on tree menu and click go button
   Then it should navigate to space page   
