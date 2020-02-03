import { when, then, and } from 'cypress-cucumber-preprocessor/steps'
import { navigateToFacility, navigateToHomePage, getCurrentPage } from '../../support'

when('I navigate to the facility', () => {
  navigateToFacility({})
})

then('the facility pre survey questionnaire should be displayed', () => {
  getCurrentPage().rightHandDrawer.preSurveyorQuestionnaire.exist()
})

and('the facility should be readonly', () => {
  getCurrentPage().rightHandDrawer.preSurveyorQuestionnaire.clickCancel()
  getCurrentPage().checkIfReadOnly(true)
})

when('I complete the pre survey questionnaire', () => {
  getCurrentPage().globalMessagePanel.PSQRequiredWarning.clickShowPSQ()
  getCurrentPage().rightHandDrawer.preSurveyorQuestionnaire.complete()
})

// TODO: not implemented
then('the pre survey questionnaire should sync to the database', () => {})

and('the facility should not be readonly', () => {
  getCurrentPage().checkIfReadOnly(false)
})

when('I return to the homepage', () => {
  navigateToHomePage()
})

and('I navigate to the facility', () => {
  navigateToFacility({})
})

then('the facility should not be readonly', () => {
  getCurrentPage().checkNotReadOnly()
})

and('the facility pre survey questionnaire should not display', () => {
  getCurrentPage().rightHandDrawer.preSurveyorQuestionnaire.notExist()
})
