import { then, when } from 'cypress-cucumber-preprocessor/steps'
import { navigateToMyEstateAssetsPage, getCurrentPage } from '../../../support'

when('I navigate to the assets page', () => {
  navigateToMyEstateAssetsPage()
})

then('I should see assets table', () => {
  getCurrentPage().checkIfHasAssetsTable()
})
