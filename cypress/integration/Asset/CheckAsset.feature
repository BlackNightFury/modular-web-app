Feature: Check Assets

  Scenario: Checking CardView
    Given an asset exists
    And I’m logged in as a surveyor
    And I've navigated to the space page
    When I switch to card view
    Then the asset cardview should be displayed

  Scenario: Check Barcode Validation
    Given an asset exists
    And I’m logged in as a surveyor
    And I've navigated to the space page
    When I update the barcode with wrong info
    Then barcode validation error should appear

  Scenario: Asset with image in other tenant
    Given an asset with image in other tenant exists
    And I’m logged in as a surveyor
    And I've navigated to the space page
    When I open that asset
    Then image should not be available

  Scenario: Detect Untagged Assets Error 
    Given wrong untagged asset exists
    And I’m logged in as a surveyor
    And I've navigated to the space page
    When I navigate to the untagged page
    Then the error should be captured
