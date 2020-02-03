import { then, when, and } from 'cypress-cucumber-preprocessor/steps'
import { navigateToLifeCycleDashboardPage, getCurrentPage } from '../../../support'

and('a selection of assets exist', () => {
  cy.createSourceSpace()
  cy.createSourceSpace()
})

when('I navigate to the lifecycle and replacement costs dashboard', () => {
    navigateToLifeCycleDashboardPage()
})

when('I close the context panel', () => {
  getCurrentPage().closeContextPanel()
})

and('I switch to the table view', () => {
  getCurrentPage().toggleView()
})

when('I set asset type filter', () => {
  getCurrentPage().setAssetTypeFilter()
})

and('I set date range filter', () => {
  getCurrentPage().setDateRangeFilter()
})

then('dashboard view should be shown', () => {
  getCurrentPage().checkIfDashboardView()
})

then('the data table should be correct', () => {
  // TODO
})

then('it should be still table view', () => {
  getCurrentPage().checkIfTableView()
})

then('filter should be applied correctly', () => {
  // TODO
})

and('Asset replacement cost by priority chart should have data', () => {
  getCurrentPage().checkIfAssetReplacementCostByPriorityChart()
})

then('Asset replacement cost by priority chart should be filtered', () => {
  getCurrentPage().checkIfAssetReplacementCostByPriorityChartFiltered()
})