import { then, when } from 'cypress-cucumber-preprocessor/steps'
import { navigateToMyEstateFacilitiesPage, getCurrentPage } from '../../../support'

when('I navigate to the facilities page', () => {
  navigateToMyEstateFacilitiesPage()
})

then('I should see facilities table', () => {
  getCurrentPage().checkIfHasFacilitiesTable()
})
