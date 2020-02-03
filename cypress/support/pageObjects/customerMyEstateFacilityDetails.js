import ProfilePanel from './profilePanel'
import LeftHandDrawer from './customerLeftHandDrawer'

export default class CustomerMyEstateFacilityDetails {
  constructor() {
    this.profilePanel = new ProfilePanel()
    this.leftHandDrawer = new LeftHandDrawer()
  }

  checkData = () => {
    cy.get('[data-test-selector="customer-facility-type"]')
      .first()
      .contains('Assembly and recreation building')
    cy.get('[data-test-selector="customer-facility-gia"]')
      .first()
      .contains(10000)
  }
}
