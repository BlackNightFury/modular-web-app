Feature: PhotoTaker 

  Scenario: PhotoTaker image delete
    Given I am navigated to phototaker component with one image
    When I click delete button
    Then it should show delete confirmation message
    When I click confirmation button
    Then it should delete current image
  
  Scenario: PhotoTaker maximum image validation
    Given I am navigated to phototaker component with 5 images
    When I click add button
    Then it should show maximum number of image validation message