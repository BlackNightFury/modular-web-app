import { then, when, and } from 'cypress-cucumber-preprocessor/steps'
import { getCurrentPage } from '../../../support'

then('the facility cardview should be displayed', () => {
  cy.get('[data-test-selector="facilitiescardlist_column"]').should('exist')
  cy.get('[data-test-selector="facilitiescardlist_card"]').should('exist')
})

when('I select the facility', () => {
  getCurrentPage().clickOnFacility()
})

then('the facility edit screen should be readonly', () => {
  getCurrentPage().checkEditFacilityDrawerDisabled()
})

and('there should be PSQ warning card', () => {
  getCurrentPage().checkPSQWarningCardVisible()
})

when('I complete the pre survey questionnaire', () => {
  getCurrentPage().clickPSQLink()
  getCurrentPage().rightHandDrawer.preSurveyorQuestionnaire.complete()
})

and('I select the facility', () => {
  getCurrentPage().clickOnFacility()
})

then('the facility edit screen should not be readonly', () => {
  getCurrentPage().checkEditFacilityDrawerEnabled()
})
