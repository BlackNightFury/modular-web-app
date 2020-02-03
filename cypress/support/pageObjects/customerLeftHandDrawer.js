import CustomerMyEstateAssets from './customerMyEstateAssets'
import CustomerMyEstateFacilities from './customerMyEstateFacilities'
import CustomerAssetReplacementCost from './customerAssetReplacementCost'
import CustomerAssetManagementDashboard from './customerAssetManagementDashboard'
import CustomerLifeCycleDashboard from './customerLifeCycleDashboard'

export default class LeftHandDrawer {
  goToMyEstateAssetsPage = () => {
    cy.get('[data-test-selector="contextpanel_estate_link"]')
      .first()
      .click()
    cy.get('[data-test-selector="asset_link"]')
      .first()
      .click()

    return new CustomerMyEstateAssets()
  }

  goToMyEstateFacilitiesPage = () => {
    cy.get('[data-test-selector="contextpanel_estate_link"]')
      .first()
      .click()
    cy.get('[data-test-selector="facility_link"]')
      .first()
      .click()

    return new CustomerMyEstateFacilities()
  }

  goToAssetReplacementCostPage = () => {
    cy.get('[data-test-selector="contextpanel_analytics_link"]')
      .first()
      .click()
    cy.get('[data-test-selector="asset_replacement_costs_dashboard_link"]')
      .first()
      .click()

    return new CustomerAssetReplacementCost()
  }

  goToAssetManagementDashboardPage = () => {
    cy.get('[data-test-selector="contextpanel_analytics_link"]')
      .first()
      .click()
    cy.get('[data-test-selector="asset_management_dashboard_link"]')
      .first()
      .click()

    return new CustomerAssetManagementDashboard()
  }

  goToLifeCycleDashboardPage = () => {
    cy.get('[data-test-selector="contextpanel_analytics_link"]')
      .first()
      .click()
    cy.get('[data-test-selector="lifecycle_and_replacement_costs_dashboard_link"]')
      .first()
      .click()

    return new CustomerLifeCycleDashboard()
  }
}
