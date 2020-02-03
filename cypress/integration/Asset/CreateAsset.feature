Feature: Create Assets

  Scenario: Add asset images in the asset form (Windows)
    Given I'm using a windows machine
    And a space exists
    And I’m logged in as a surveyor
    And I've navigated to the space page
    And I'm adding an asset
    When I click the camera icon
    Then the web based camera dialog should show
    When I capture the photo
    And Save the asset
    Then the image should persist correctly

  Scenario: Add asset images in the non-camera device
    Given I'm using a non-camera machine
    And a space exists
    And I’m logged in as a surveyor
    And I've navigated to the space page
    And I'm adding an asset
    Then the camera icon should not be shown

  Scenario Outline: Creating an asset as a <type> surveyor
    Given a space exists
    And I’m logged in as a <type> surveyor
    And I've navigated to the space page
    When I create an asset
    Then the asset should appear in the table
    And the asset should sync to the database
    Examples:
        | type           |
        | testTenant     |
        # | global         |

  Scenario: Creating an asset with a reminder note and last barcode increment
    Given a space exists
    And I’m logged in as a surveyor
    And I've navigated to the space page
    When I create an asset with a reminder note
    Then the asset should appear in the table
    And the asset should sync to the database
    When I create an asset with last barcode increment
    Then the asset should have next barcode

  Scenario: Untagged Asset
    Given a space exists
    And I’m logged in as a surveyor
    And I've navigated to the space page
    When I create an untagged asset
    Then the asset should appear in the table
    And the asset should sync to the database
    When I click the edit asset
    And change bypass option inside drawer
    And save the asset
    Then no validation message should appear
    And the asset should appear in the untagged asset report

  Scenario: Create asset subscription
    Given a space exists
    And I’m logged in as a surveyor
    And I've navigated to the space page
    When the asset is created by other surveyors
    Then it should appear in the table
