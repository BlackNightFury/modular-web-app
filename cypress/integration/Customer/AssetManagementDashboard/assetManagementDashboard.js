import { then, when, and } from 'cypress-cucumber-preprocessor/steps'
import { navigateToAssetManagementDashboardPage, getCurrentPage } from '../../../support'

and('a selection of assets exist', () => {
  cy.createSourceSpace()
  cy.createSourceSpace()
})

when('I navigate to the asset management dashboard', () => {
  navigateToAssetManagementDashboardPage()
})

when('I close the context panel', () => {
  getCurrentPage().closeContextPanel()
})

and('I switch to the table view', () => {
  getCurrentPage().toggleView()
})

and('I set the filter', () => {
  getCurrentPage().setFilter()
})

then('the assets by condition and facility chart should have data', () => {
  getCurrentPage().checkIfAssetManagementChart()
})

then('assets by system and type chart should have data', () => {
  getCurrentPage().checkIfAssetsBySystemAndTypeChart()
})

then('the data table should be correct', () => {
  getCurrentPage().checkIfTableView()
  getCurrentPage().checkIfAssetManagementTable()
})

then('it should be still table view', () => {
  getCurrentPage().checkIfTableView()
})

then('the assets by condition and facility chart should be filtered', () => {
  getCurrentPage().checkIfChartFiltered()
})

then('assets by system and type chart should be filtered', () => {
  getCurrentPage().checkIfAssetsBySystemAndTypeChartFiltered()
})