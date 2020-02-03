Feature: Copy Assets

  Scenario: Copy Assets
    Given a source space with assets exists
    And a destination space exists
    And I’m logged in as a surveyor
    And I've navigated to the destination space
    When I select a source space
    And select copy assets
    Then all assets should be shown in the drawer
    When I select assets
    Then I should be taken to the copy assets page
    And the assets should be available in the assets table
    And I should not be able to complete
    When I try to leave the page
    Then copy process warning message appears
    When I continue copy and complete all assets
    Then I should be able to complete
    When I complete
    Then I should be taken to the destination space
    And the assets should be available in the assets table of the space

  Scenario: Copy a single asset
    Given an asset exists
    And I’m logged in as a surveyor
    And I've navigated to the space page
    When I copy an asset
    Then the asset should be available in the assets list