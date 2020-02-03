import { given, when, then, and } from 'cypress-cucumber-preprocessor/steps'
import {
  getCurrentPage,
  loginAsSurveyor,
  loginAsGlobalSurveyor,
  navigateToSpace,
} from '../../../support'

given('I’m logged in as a testTenant surveyor', () => {
  loginAsSurveyor()
})

given('I’m logged in as a global surveyor', () => {
  loginAsGlobalSurveyor()
})

and('I’m logged in as a surveyor', () => {
  loginAsSurveyor()
})

and("I've navigated to the space page", () => {
  navigateToSpace()
})

when('I create an asset with last barcode increment', () => {
  getCurrentPage().createAsset({ lastBarcodeIncrement: true })
})

then('the asset should have next barcode', () => {
  getCurrentPage().checkIfCorrectNextBarcode()
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
  row
    .get('[data-test-selector="assetstable_manufacturer"]')
    .invoke('text')
    .should(text => {
      expect(text).not.to.eq('')
    })
  row
    .get('[data-test-selector="assetstable_barcode"]')
    .invoke('text')
    .should(text => {
      expect(text).not.to.eq('')
    })
  row
    .get('[data-test-selector="assetstable_install_date"]')
    .invoke('text')
    .should(text => {
      expect(text).not.to.eq('')
    })
})

and('the asset should sync to the database', () => {})

when('I create an asset with a reminder note', () => {
  getCurrentPage().createAsset({ withReminder: true })
})

when('I create an untagged asset', () => {
  getCurrentPage().createAsset({ untagged: true })
})

and('the asset should appear in the untagged asset report', () => {
  getCurrentPage().selectUntaggedAssetPage()
  const row = cy.get('[data-test-selector="assetstable_row"]').first()
  row.should('contain', 'Amplifier')
  row.should('contain', '2019')
  row.should('contain', 'A')
  row.should('contain', '1')
})

given("I'm using a windows machine", () => {
  cy.window().then(win => {
    win.mwa_config.MOCK_OS = 'windows'
  })
})

given("I'm using a non-camera machine", () => {
  cy.window().then(win => {
    win.mwa_config.MOCK_NON_CAMERA = true
  })
})

when("I'm adding an asset", () => {
  getCurrentPage().addAsset()
})

when('I click the camera icon', () => {
  getCurrentPage().openCamera()
})

then('the web based camera dialog should show', () => {
  cy.get('.ant-modal-content').should('exist')
  cy.wait(3000)
  cy.get('video').should('exist')
})

then('the camera icon should not be shown', () => {
  cy.get('[data-test-selector="add-image-icon"]').should('not.exist')
})

when('I capture the photo', () => {
  getCurrentPage().capturePhoto()
})

when('Save the asset', () => {
  getCurrentPage().saveAsset()
})

then('the image should persist correctly', () => {
  cy.get('[data-test-selector="assetstable_row"]')
    .first()
    .click()
  cy.get('.carousel').should('exist')
})

when('the asset is created by other surveyors', () => {
  // This is to give enough margin to initiate subscription
  cy.wait(15000)

  cy.createAssetInFacility().then({ timeout: 10000 }, () => {})
})

then('it should appear in the table', () => {
  cy.getSubscribedAssetInfo().then(({ assetId, assetType }) => {
    const row = cy.get(`[data-test-record-id="${assetId}"]`, { timeout: 15000 }).first()
    row.should('contain', assetType)
  })
})

when('I click the edit asset', () => {
  getCurrentPage().clickEditAsset()
})

and('change bypass option inside drawer', () => {
  cy.get('[type="radio"]')
    .last()
    .check()
})

and('save the asset', () => {
  getCurrentPage().saveAsset()
})

then('no validation message should appear', () => {
  cy.get('.ant-form-explain').should('not.exist')
})
