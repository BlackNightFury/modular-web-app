import ProfilePanel from './profilePanel'
import VirtualAssetForm from './virtualAssetForm'
import DataTable from './dataTable'
import Header from './header'
import RightHandDrawer from './rightHandDrawer'
import GlobalMessagePanel from './globalMessagePanel'

export default class VirtualAssetsPage {
  constructor() {
    this.virtualAssetForm = new VirtualAssetForm('addvirtualassetpanel')
    this.profilePanel = new ProfilePanel()
    this.dataTable = new DataTable()
    this.header = new Header()
    this.rightHandDrawer = new RightHandDrawer()
    this.globalMessagePanel = new GlobalMessagePanel()
  }

  checkReadOnly = () => {
    cy.get('[data-test-selector="add_virtual_asset"]').should('be.disabled')
    cy.get('[data-test-selector="assetstable_row"]')
      .first()
      .click({ force: true })
    cy.get('button[type=submit]').should('be.disabled')
  }
}
