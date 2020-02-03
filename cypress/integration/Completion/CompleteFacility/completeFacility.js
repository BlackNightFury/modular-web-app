import { when, then, and, given } from 'cypress-cucumber-preprocessor/steps'
import {
  navigateToFacility,
  getCurrentPage,
  navigateToHomePage,
  navigateToCompleteFacilityPage,
  shouldBeOn,
} from '../../../support'

given("I've done some work", () => {
  navigateToFacility({ autoCompletePSQ: true })
})

when('I navigate to my work', () => {
  navigateToHomePage()
})

and('I select complete facility from the context panel', () => {
  getCurrentPage().leftHandDrawer.contextPanel.goToCompleteFacility()
})

then('I should be taken to the completion page', () => {
  navigateToCompleteFacilityPage()
})

when('I navigate to the facility', () => {
  navigateToHomePage()
  navigateToFacility({ autoCompletePSQ: true })
})

when('I select complete facility from my work', () => {
  getCurrentPage().clickCompleteFacility()
})

and('the complete button should be disabled', () => {
  getCurrentPage().disabledCompleteBtn()
})

when('I complete the form', () => {
  getCurrentPage().fill()
})

then('the complete button should be enabled', () => {
  getCurrentPage().enabledCompleteBtn()
})

when('I submit the form', () => {
  getCurrentPage().complete()
})

then('I should be taken to my work', () => {
  shouldBeOn('/data-collection/home')
})

and('the completion should sync to the database', () => {})

when('the completion is succeeded', () => {})

then('I should see the completion global message', () => {
  getCurrentPage().checkCompletionGlobalMessage(true)
})

and('completion global message should disappear after 5secs', () => {
  cy.wait(5000)
  getCurrentPage().checkCompletionGlobalMessage(false)
})

when('I save the progress', () => {
  getCurrentPage().saveCompleteFacilityProgress()
})

and('I refresh the page', () => {
  cy.reload()
})

then('the complete facility details should be saved', () => {
  getCurrentPage().checkCompleteFacilityDetailsSaved()
})
