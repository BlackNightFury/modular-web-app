Feature: Update Assets

  Scenario Outline: Updating an asset as a <type> surveyor
    Given an asset exists
    And I’m logged in as a <type> surveyor
    And I've navigated to the space page
    When I update the asset info
    Then the update should appear in the table
    And the update should sync to the database
    Examples:
        | type           |
        | testTenant     |
        # | global         |

  Scenario: Update asset subscription
    Given an asset exists
    And I’m logged in as a surveyor
    And I've navigated to the space page
    When the asset is updated by other surveyors
    Then it should appear in the table
