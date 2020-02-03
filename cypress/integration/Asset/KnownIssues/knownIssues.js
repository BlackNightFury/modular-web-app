import { given, when, then } from 'cypress-cucumber-preprocessor/steps'
import { getCurrentPage } from '../../../support'

given('assets with duplicate barcodes exist', () => {
  cy.createSourceSpace()
})

when('I refresh the known issues', () => {
  getCurrentPage().refreshKnownIssues()
})

then('the known issue should be displayed', () => {
  getCurrentPage().checkKnownIssuesShown()
})
