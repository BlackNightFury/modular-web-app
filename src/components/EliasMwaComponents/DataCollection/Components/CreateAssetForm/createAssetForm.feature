Feature: Create asset form

  Scenario: Creating an asset
    When I save an asset
    Then submitted values should be correct

  Scenario: Creating an asset with a reminder note
    When I save an asset with a reminder note
    Then the created asset should be persisted with a reminder note
  
  Scenario: Increment barcode
    Given I've previously created an asset
    When I increment the asset barcode
    Then next barcode number should be used

  Scenario: Invalid data
    When I save an asset with invalid data
    Then type validation message should appear

  Scenario: Duplicated Barcode validation
    When I save an asset with same barcode of existing one
    Then duplicated barcode validation message should appear