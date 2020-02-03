import ProfilePanel from './profilePanel'
import LeftHandDrawer from './customerLeftHandDrawer'

export default class CustomerHomePage {
  constructor() {
    this.profilePanel = new ProfilePanel()
    this.leftHandDrawer = new LeftHandDrawer()
  }

  checkIfHasAssetsTable = () => {
    cy.get('[data-test-selector="assetstable"]').should('exist')
  }
}
