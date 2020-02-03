Feature: Known Issues Listing

  Scenario: Show Known Issues
    When there is barcode duplication issue
    Then the known issue should be displayed
    When user updates the barcode and press refresh button
    Then there should be no known issues

  Scenario: Duplicate barcode known issue
    Given assets with duplicate barcodes exist
    When I refresh the known issues
    Then the known issue should be displayed