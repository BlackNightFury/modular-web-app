import { given, when, then, and } from 'cypress-cucumber-preprocessor/steps'
import shortid from 'shortid'
import {
  loginAsSurveyorToPrototype,
  loginAsCustomerToPrototype,
  getCurrentPage,
  navigateToFacility,
  navigateToFloor,
  navigateToSpace,
  navigateToAssetReplacementCostPage,
} from '../../support'

given('I’m logged in as a surveyor', () => {
  loginAsSurveyorToPrototype()
})

given('I’m logged in as a customer', () => {
  loginAsCustomerToPrototype()
})

and('I’ve navigated to the space page', () => {
  navigateToFacility({ selectFirstRow: true })
  getCurrentPage().createFloor(shortid.generate())
  navigateToFloor()
  getCurrentPage().createSpace(shortid.generate())
  navigateToSpace()
})

when('I create an asset', () => {
  getCurrentPage().createAsset()
})

then('the asset should appear in the table', () => {
  const row = cy.get('[data-test-selector="assetstable_row"]').first()
  row.should('contain', 'Amplifier')
  row.should('contain', '2019')
  row.should('contain', 'A')
  row.should('contain', '1')
})

and('the asset should sync to the database', () => {})

when('I navigate to the asset replacement cost dashboard', () => {
  navigateToAssetReplacementCostPage()
})

then('I should see facilities table', () => {
  getCurrentPage().checkIfHasFacilityInfoTable()
})
