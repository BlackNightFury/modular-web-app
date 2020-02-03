import { given, when, then, and } from 'cypress-cucumber-preprocessor/steps'
import shortid from 'shortid'
import {
  loginAsSurveyorToTentantWithVAAtSpace,
  getCurrentPage,
  navigateToFacility,
  navigateToFloor,
  navigateToSpace,
} from '../../support'

given('I’m logged in as a surveyor', () => {
  loginAsSurveyorToTentantWithVAAtSpace()
})

given("I've navigated to the space page", () => {
  navigateToFacility({ autoCompletePSQ: true, selectFirstRow: true })
  getCurrentPage().createFloor(shortid.generate())
  navigateToFloor()
  getCurrentPage().createSpace(shortid.generate())
  navigateToSpace()
})

when('I navigate to a facility', () => {
  navigateToFacility({ autoCompletePSQ: true, selectFirstRow: true })
})

and('I create a floor', () => {
  getCurrentPage().createFloor(shortid.generate())
})

then('the virtual asset link should not be available on the floor', () => {
  cy.get('[data-test-selector="floorstable_row"]')
    .first()
    .find('[data-test-selector="floorstable_action_dropdown"]')
    .click()
  cy.get('li')
    .contains('Virtual assets')
    .should('not.exist')
})

and('I cannot navigate to the virtual assets screen', () => {
  // I have no idea how to disable the routing in the app, please help me!
  // Now it is returning 404 Error manually
})

when('I create a virtual asset', () => {
  getCurrentPage().virtualAssetForm.createVirtualAsset(true)
})

then('the asset should appear in the table', () => {
  const row = cy.get('[data-test-selector="assetstable_row"]').first()
  row.should('contain', 'Card Readers')
  row.should('contain', 'B')
  row.should('contain', '123')
  row.should('contain', '2019')
})

then('the asset should sync to the database', () => {})

and('a virtual asset exists', () => {
  getCurrentPage().virtualAssetForm.createVirtualAsset(true)
})

when('I update the quantity of the virtual asset', () => {
  getCurrentPage().virtualAssetForm.updateVirtualAsset()
})

then('the update should appear in the table', () => {
  const row = cy.get('[data-test-selector="assetstable_row"]').first()
  row.should('contain', 'Card Readers')
  row.should('contain', '2019')
  row.should('contain', 'B')
  row.should('contain', '128')
})

then('the update should sync to the database', () => {})

then('the asset cardview should be displayed', () => {
  cy.get('[data-test-selector="assetcardlist_column"]').should('exist')
  cy.get('[data-test-selector="assetcardlist_card"]').should('exist')
})

when('I add the same virtual asset', () => {
  getCurrentPage().virtualAssetForm.createVirtualAsset(true, true)
  cy.get('.ant-modal-confirm-btns')
    .find('button')
    .contains('Yes')
    .click({ force: true })
})

then('a new virtual asset should not be created', () => {
  cy.get('[data-test-selector="assetstable_row"]')
    .its('length')
    .should('eq', 1)
})

and('the existing virtual asset should be updated', () => {
  const row = cy.get('[data-test-selector="assetstable_row"]').first()
  row.should('contain', 'Card Readers')
  row.should('contain', '01/01/2019')
  row.should('contain', 'B')
  row.should('contain', '246')
})