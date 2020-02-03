import { then, when } from 'cypress-cucumber-preprocessor/steps'
import { navigateToMyEstateFacilitiesPage, getCurrentPage } from '../../../support'

when('I navigate to the facility details page', () => {
  navigateToMyEstateFacilitiesPage()
  getCurrentPage().goToFacilityDetails()
})

then('the faciltiy details should be shown', () => {
  getCurrentPage().checkData()
})
