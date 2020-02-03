import { given, when, then, and } from 'cypress-cucumber-preprocessor/steps'
import { getCurrentPage, loginAsSurveyor, navigateToSpace } from '../../../support'

and('I’m logged in as a surveyor', () => {
  loginAsSurveyor()
})

and("I've navigated to the space page", () => {
  navigateToSpace()
})

when('I switch the asset view to card view', () => {
  getCurrentPage().selectCardView()
})

then('the asset cardview should be displayed', () => {
  cy.get('[data-test-selector="assetcardlist_column"]').should('exist')
  cy.get('[data-test-selector="assetcardlist_card"]').should('exist')
})

when('I update the barcode with wrong info', () => {
  getCurrentPage().updateBarcodeWithWrongInfo()
})

then('barcode validation error should appear', () => {
  cy.contains('Barcode')
    .siblings('.ant-form-explain')
    .should('exist')
})

given('an asset with image in other tenant exists', () => {
  cy.createAssetWithImageInOtherTenant()
})

when('I open that asset', () => {
  cy.get('[data-test-selector="assetstable_row"]')
    .first()
    .click()
})

then('image should not be available', () => {
  cy.get('.slide.selected:last-child > div > canvas').should('not.exist')
})

given('wrong untagged asset exists', () => {
  cy.createAsset({ wrongUntagged: true })
})

when('I navigate to the untagged page', () => {
  getCurrentPage().selectUntaggedAssetPage()
})

then('the error should be captured', () => {
  cy.get('[data-test-selector="assetstable"]').should('exist')
})