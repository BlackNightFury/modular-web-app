Feature: Asset card list
  Scenario: CardView on the asset list view
    Given I am on the asset list view
    When I switch to card view
    Then the asset cardview should be displayed

  Scenario: Tooltip on the asset list view
    Given I am on the asset list view
    When I switch to card view
    Then the card view tooltip should be available

  Scenario: Edit Action on the asset list view
    Given I am on the asset list view
    When I switch to card view
    Then the edit button should be available
    When I click edit button
    Then edit event should be triggered

  Scenario: Delete Action on the asset list view
    Given I am on the asset list view
    When I switch to card view
    When I click the multi action button
    Then the actions list should be shown
    When I delete the item
    Then delete event should be triggered

  Scenario: CardView on the virtual asset list view
    Given I am on the virtual asset list view
    When I switch to card view
    Then the virtual asset cardview should be displayed

  Scenario: Tooltip on the virtual asset list view
    Given I am on the virtual asset list view
    When I switch to card view
    Then the card view tooltip should be available

  Scenario: Edit Action on the virtual asset list view
    Given I am on the virtual asset list view
    When I switch to card view
    Then the edit button should be available
    When I click edit button
    Then edit event should be triggered

  Scenario: Delete Action on the virtual asset list view
    Given I am on the virtual asset list view
    When I switch to card view
    When I click the multi action button
    Then the actions list should be shown
    When I delete the item
    Then delete event should be triggered
