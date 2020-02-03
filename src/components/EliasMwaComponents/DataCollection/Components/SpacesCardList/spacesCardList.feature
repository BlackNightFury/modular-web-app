Feature: Spaces card list
  Scenario: Checking CardView
    When I switch to card view on spaces list view
    Then the spaces cardview should be displayed
    When I click assets link
    Then it should be redirected to space page
    When I click favorite button
    Then the space should be one of favorite space