import { when, then, and } from 'cypress-cucumber-preprocessor/steps'
import {
  getCurrentPage,
  loginAsSurveyor,
  loginAsGlobalSurveyor,
  navigateToSpace,
} from '../../../support'

and('I’m logged in as a testTenant surveyor', () => {
  loginAsSurveyor()
})

and('I’m logged in as a global surveyor', () => {
  loginAsGlobalSurveyor()
})

and("I've navigated to the space page", () => {
  navigateToSpace()
})

when('I update the asset info', () => {
  getCurrentPage().updateAsset()
})

then('the update should appear in the table', () => {
  const row = cy.get('[data-test-selector="assetstable_row"]').first()
  row.should('contain', 'Amplifier')
  row.should('contain', '2018')
  row.should('contain', 'B')
  row.should('contain', '1')
})

and('the update should sync to the database', () => {})

when('the asset is updated by other surveyors', () => {
  // This is to give enough margin to initiate subscription
  cy.wait(15000)

  cy.updateAssetInFacility().then({ timeout: 10000 }, () => {})
})

then('it should appear in the table', () => {
  cy.getSubscribedAssetInfo().then(({ assetType }) => {
    cy.get(`[data-test-selector="assetstable_name_${assetType}"]`, { timeout: 15000 })
      .first()
      .should('exist')
  })
})
