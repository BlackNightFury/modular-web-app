import { given, when, then } from 'cypress-cucumber-preprocessor/steps'
import {
  loginAsSurveyor,
  logout,
  getCurrentPage,
  navigateToHomePage,
  navigateToFacility,
  navigateToFloor,
  navigateToSpace,
  navigateToVirtualAssetsPage,
} from '../../support'

given("I've done some work", () => {
  navigateToFacility({ autoCompletePSQ: true })
  navigateToVirtualAssetsPage()
  getCurrentPage().virtualAssetForm.createVirtualAsset()
})

when('I complete the site', () => {
  cy.completeSurveyor()
})

then('the site should be readonly', () => {
  // It takes quite so long time(normally 60s) to sync the appsync data after set the readonly flag of the project
  // To sync the appsync data as soon as possible, manually log out and back in
  logout()
  cy.visit('/')
  loginAsSurveyor()

  navigateToFacility({ autoCompletePSQ: true })
  getCurrentPage().checkIfReadOnly(true)
  navigateToVirtualAssetsPage()
  getCurrentPage().checkReadOnly()
  navigateToHomePage()
  navigateToFloor()
  getCurrentPage().checkReadOnly()
  navigateToSpace()
  getCurrentPage().checkReadOnly()
})

when('I click the project docs link', () => {
  navigateToFacility({ autoCompletePSQ: true, selectFirstRow: true })
  getCurrentPage().leftHandDrawer.contextPanel.navigateToProjectDoc()
})

then('the pdf should be shown', () => {
  cy.get('@project_doc_href').then(url =>
    cy
      .request(url)
      .its('body')
      .should('not.include', '</html>'),
  )
})
