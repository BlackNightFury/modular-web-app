import ProfilePanel from './profilePanel'
import LeftHandDrawer from './customerLeftHandDrawer'
import { setCurrentPage } from '..'
import CustomerMyEstateFacilityDetails from './customerMyEstateFacilityDetails'

export default class CustomerMyEstateFacilities {
  constructor() {
    this.profilePanel = new ProfilePanel()
    this.leftHandDrawer = new LeftHandDrawer()
  }

  checkIfHasFacilitiesTable = () => {
    cy.get('[data-test-selector="facilitiestable"]').should('exist')
  }

  goToFacilityDetails = () => {
    cy.get('th')
      .last()
      .click({ force: true })
    cy.get('th')
      .last()
      .click({ force: true })
    cy.get('[data-test-selector="customer-facility-list-item"]')
      .first()
      .click({ force: true })
    setCurrentPage(new CustomerMyEstateFacilityDetails())
  }
}
