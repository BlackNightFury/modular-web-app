Feature: Facility Page

Scenario: Pre survey questionnaire not completed
  When the pre surveyor questionnaire is not completed
  Then a warning card should be shown

Scenario: Facility completed by surveyor
  When the facility is completed
  Then an info card should be shown

Scenario: Project set readonly by project manager
  When the project is readonly
  Then an info card should be shown

Scenario: Completed Warning Message
  When the facility is completed
  Then the completed warning card should be shown
  Then the completed warning card should be hidden after 5 seconds

Scenario: Show Status Filter
  When the facility page is mounted
  Then the status filter should be shown