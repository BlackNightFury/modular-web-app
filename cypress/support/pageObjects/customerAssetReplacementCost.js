import ProfilePanel from './profilePanel'
import LeftHandDrawer from './customerLeftHandDrawer'

export default class CustomerAssetReplacementCost {
  constructor() {
    this.profilePanel = new ProfilePanel()
    this.leftHandDrawer = new LeftHandDrawer()
  }

  checkIfHasFacilityInfoTable = () => {
    cy.get('[data-test-selector="facility_info_table"]').should('exist')
  }
}
