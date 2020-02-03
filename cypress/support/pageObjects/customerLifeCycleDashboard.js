import ProfilePanel from './profilePanel'
import LeftHandDrawer from './customerLeftHandDrawer'

export default class CustomerAssetManagementDashboard {
  constructor() {
    this.profilePanel = new ProfilePanel()
    this.leftHandDrawer = new LeftHandDrawer()
  }

  checkIfDashboardView = () => {
    cy.get('[data-test-selector="lifecycle_and_replacementcosts_dashboardview"]')
      .should('exist')
  }

  toggleView = () => {
    cy.get('[data-test-selector="lifecycle_viewswitch"]').click()
  }

  setAssetTypeFilter = () => {
    cy.get(`[data-test-selector="filterbybutton_container"]`).click()
    cy.get('.ant-select-tree-switcher')
      .first()
      .click()
    cy.get('.ant-select-tree-node-content-wrapper')
      .contains('Access')
      .click()
    cy.get('.ant-select-tree-node-content-wrapper')
      .contains('Amplifier')
      .click()
    cy.wait(4000)
  }

  setDateRangeFilter = () => {
    cy.get(`[data-test-selector="filterbybutton_container"]`).click()
    cy.get('.ant-select-tree-switcher')
      .last()
      .click()
    cy.get('.ant-select-tree-node-content-wrapper')
      .contains('Install date')
      .click()
    cy.get('.ant-calendar-picker-input input')
      .first()
      .click()
    cy.get('.ant-calendar-date').first().click()
    cy.get('.ant-calendar-date').last().click()
  }

  checkIfChartFiltered = () => {
    cy.get('[data-test-selector="asset_management_dashboard_chart"] [text-anchor="end"]')
      .its('length')
      .should('be.gte', 1)
    cy.get('.highcharts-legend-item > .highcharts-point').should('have.length', 1)
  }

  checkIfAssetReplacementCostByPriorityChart = () => {
    cy.get('[data-test-selector="asset_replacement_costs_by_priority_chart"] [text-anchor="end"]')
      .its('length')
      .should('be.gte', 4)
  }

  checkIfAssetReplacementCostByPriorityChartFiltered = () => {
    cy.get(
      '[data-test-selector="asset_replacement_costs_by_priority_chart"] [text-anchor="end"]',
    ).should('have.length', 1)
  }

  closeContextPanel = () => {
    cy.get('[data-test-selector="toggleButton"]').click()
  }

  checkIfTableView = () => {
    cy.get('[data-test-selector="assetstable"]').should('exist')
  }
}
