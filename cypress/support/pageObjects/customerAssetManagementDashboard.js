import ProfilePanel from './profilePanel'
import LeftHandDrawer from './customerLeftHandDrawer'

export default class CustomerAssetManagementDashboard {
  constructor() {
    this.profilePanel = new ProfilePanel()
    this.leftHandDrawer = new LeftHandDrawer()
  }

  checkIfAssetManagementChart = () => {
    cy.get('[data-test-selector="asset_management_dashboard_chart"] [text-anchor="end"]')
      .its('length')
      .should('be.gte', 4)
  }

  checkIfAssetsBySystemAndTypeChart = () => {
    cy.get('[data-test-selector="assets_by_system_and_type_chart"] .highcharts-parentNode')
      .its('length')
      .should('be.gte', 2)
  }

  checkIfAssetManagementTable = () => {
    cy.get('[data-test-selector="assetstable_row"')
      .its('length')
      .should('be.gte', 4)
  }

  toggleView = () => {
    cy.get('[data-test-selector="assetmanagement_viewswitch"]').click()
  }

  setFilter = () => {
    cy.get(`[data-test-selector="filterbybutton_container"]`).click()
    cy.get('.ant-select-tree-switcher')
      .first()
      .click()
    cy.get('.ant-select-tree-node-content-wrapper')
      .contains('Access')
      .click()
    cy.get('.ant-select-tree-node-content-wrapper')
      .contains('Audio Visual Eq')
      .click()
    cy.get('ul')
      .last()
      .find('li')
      .contains('Audio Visual Equipment')
      .click()
    cy.wait(4000)
  }

  checkIfChartFiltered = () => {
    cy.get('[data-test-selector="asset_management_dashboard_chart"] [text-anchor="end"]')
      .its('length')
      .should('be.gte', 1)
    cy.get('.highcharts-legend-item > .highcharts-point').should('have.length', 1)
  }

  checkIfAssetsBySystemAndTypeChartFiltered = () => {
    cy.get(
      '[data-test-selector="assets_by_system_and_type_chart"] .highcharts-parentNode',
    ).should('have.length', 1)
  }

  closeContextPanel = () => {
    cy.get('[data-test-selector="toggleButton"]').click()
  }

  checkIfTableView = () => {
    cy.get('[data-test-selector="assetstable"]').should('exist')
  }
}
