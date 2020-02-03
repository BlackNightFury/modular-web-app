import { given, when, then, and } from 'cypress-cucumber-preprocessor/steps'
import { getCurrentPage, loginAsSurveyor, navigateToSpace } from '../../../support'

given('a source space with assets exists', () => {
  cy.createSourceSpace()
})

and('a destination space exists', () => {
  cy.createSpace().then({ timeout: 10000 }, () => {})
})

and('I’m logged in as a surveyor', () => {
  loginAsSurveyor()
})

and(`I've navigated to the destination space`, () => {
  navigateToSpace()
})

when('I select a source space', () => {
  getCurrentPage().leftHandDrawer.contextPanel.selectSourceSpace()
})

and('select copy assets', () => {
  getCurrentPage().leftHandDrawer.contextPanel.selectCopyAssets()
})

then('all assets should be shown in the drawer', () => {
  getCurrentPage().rightHandDrawer.copyAssetsForm.allAssetsExist()
})

when('I select assets', () => {
  getCurrentPage().rightHandDrawer.copyAssetsForm.selectAssets()
})

then('I should be taken to the copy assets page', () => {
  cy.get('span')
    .contains('Copy assets to')
    .should('exist')
})

and('the assets should be available in the assets table', () => {
  cy.get('[data-test-selector="assetstable_row"] > td').eq(0).should('contain', 'Amplifier')
  cy.get('[data-test-selector="assetstable_row"] > td').eq(3).should('not.contain', '1')
  cy.get('[data-test-selector="assetstable_row"] > td').eq(4).should('contain', 'IN_PROGRESS')
})

and('I should not be able to complete', () => {
  cy.get('[data-test-selector="complete_copy"]').should('be.disabled')
})

when('I try to leave the page', () => {
  cy.get('[data-test-selector="breadcrumb-text"]').eq(0).click()
})

then('copy process warning message appears', () => {
  cy.get('[data-test-selector="stop_copy_asset_confirm_title"]').should('exist')
})

when('I continue copy and complete all assets', () => {
  cy.contains('Continue copy')
    .click()
  cy.get('[data-test-selector="assetstable_row"]')
    .first()
    .click()
  getCurrentPage().rightHandDrawer.editAssetForm.completeAsset()
})

then('I should be able to complete', () => {
  cy.get('[data-test-selector="complete_copy"]').should('be.enabled')
})

when('I complete', () => {
  cy.get('[data-test-selector="complete_copy"]').click()
})

then('I should be taken to the destination space', () => {
  cy.get('span')
    .contains('Copy assets to')
    .should('not.exist')
})

and('the assets should be available in the assets table of the space', () => {
  const row = cy.get('[data-test-selector="assetstable_row"]').first()
  row.should('contain', 'Amplifier')
  row.should('contain', '123456789')
  row.should('contain', 'B')
  row.should('contain', '1')
})

and("I've navigated to the space page", () => {
  navigateToSpace()
  cy.wait(4000)
})

when('I copy an asset', () => {
  cy.get('button[data-test-selector="assetstable_action_dropdown"]')
    .first()
    .click()
  cy.get('ul')
    .find('li')
    .contains('Copy')
    .click()
  getCurrentPage().rightHandDrawer.editAssetForm.completeAsset()
})

and('the asset should be available in the assets list', () => {
  const row = cy.get('[data-test-selector="assetstable_row"]').first()
  row.should('contain', 'Amplifier')
  row.should('contain', '123456789')
  row.should('contain', 'B')
  row.should('contain', '1')
})
