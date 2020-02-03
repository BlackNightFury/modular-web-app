import { when, then, and } from 'cypress-cucumber-preprocessor/steps'
import { getCurrentPage } from '../../support'

when('I create a virtual asset', () => {
  getCurrentPage().virtualAssetForm.createVirtualAsset()
})

then('the asset should appear in the table', () => {
  const row = cy.get('[data-test-selector="assetstable_row"]').first()
  row.should('contain', 'Card Readers')
  row.should('contain', 'B')
  row.should('contain', '123')
  row.should('contain', '2019')
})

then('the asset should sync to the database', () => {})

then('the update should appear in the table', () => {
  const row = cy.get('[data-test-selector="assetstable_row"]').first()
  row.should('contain', 'Card Readers')
  row.should('contain', '2019')
  row.should('contain', 'B')
  row.should('contain', '128')
})

then('the update should sync to the database', () => {})

when('I update the quantity of the virtual asset', () => {
  getCurrentPage().virtualAssetForm.updateVirtualAsset()
})

when('I add the same virtual asset', () => {
  getCurrentPage().virtualAssetForm.createVirtualAsset()
  cy.get('button')
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

then('the asset cardview should be displayed', () => {
  cy.get('[data-test-selector="assetcardlist_column"]').should('exist')
  cy.get('[data-test-selector="assetcardlist_card"]').should('exist')
})
