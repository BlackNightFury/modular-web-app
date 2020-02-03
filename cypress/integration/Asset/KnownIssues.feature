Feature: KnownIssues Assets

  Scenario: Duplicate barcode known issue
    Given assets with duplicate barcodes exist
    And I’m logged in as a surveyor
    When I refresh the known issues
    Then the known issue should be displayed