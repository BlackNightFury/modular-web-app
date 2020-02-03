import { then, when, and } from 'cypress-cucumber-preprocessor/steps'
import { getCurrentPage, navigateToFacility } from '../../../support'

when('I click the multi action button', () => {
  getCurrentPage().selectFacilityMultiActionButton()
})

then('the actions list should be shown', () => {
  getCurrentPage().checkFacilityActionList()
})

when('I update the facility info', () => {
  getCurrentPage().clickEditFacility()
  getCurrentPage().checkEditFacilityDrawerShown()
  getCurrentPage().clickPSQLink()
  getCurrentPage().rightHandDrawer.preSurveyorQuestionnaire.complete()
  getCurrentPage().clickOnFacility()
  getCurrentPage().updateFacility()
})

then('the update should appear in the table', () => {
  const row = cy.get('[data-test-selector="facilitiestable_row"]').first()
  row.should('contain', '00000')
})

and('the update should sync to the database', () => {})

when('I navigate to the facility', () => {
  navigateToFacility({ autoCompletePSQ: true })
})

and('I click the edit facility', () => {
  getCurrentPage().clickEditFacility()
})

then('the edit facility drawer should be shown', () => {
  getCurrentPage().checkEditFacilityDrawerShown()
})
