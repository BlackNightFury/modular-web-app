import ProfilePanel from './profilePanel'
import DataTable from './dataTable'
import AssetForm from './AssetForm'
import VirtualAssetForm from './virtualAssetForm'
import Header from './header'
import LeftHandDrawer from './leftHandDrawer'
import RightHandDrawer from './rightHandDrawer'
import GlobalMessagePanel from './globalMessagePanel'
import { openMyWorkModuleOnContextPanel } from '..'

export default class SpacePage {
  constructor() {
    this.profilePanel = new ProfilePanel()
    this.dataTable = new DataTable()
    this.assetForm = new AssetForm('addassetpanel')
    this.virtualAssetForm = new VirtualAssetForm('addassetpanel')
    this.leftHandDrawer = new LeftHandDrawer()
    this.rightHandDrawer = new RightHandDrawer()
    this.header = new Header()
    this.globalMessagePanel = new GlobalMessagePanel()
  }

  selectCardView = () => {
    cy.get('[data-test-selector="cardswitch"]').click()
  }

  createAsset(options) {
    this.assetForm.createAsset(options)
  }

  checkIfCorrectNextBarcode = () => {
    this.assetForm.checkIfCorrectNextBarcode()
  }

  updateAsset() {
    this.assetForm.updateAsset()
  }

  updateBarcodeWithWrongInfo = () => {
    cy.get('[data-test-selector="assetstable"] .ant-table-row')
      .first()
      .click({ force: true })
    cy.get('[data-test-selector="barcode_input"]')
      .clear()
      .type('2324')
    cy.get('[data-test-selector="form-submit"]')
      .last()
      .click()
  }

  checkReadOnly = () => {
    cy.get('[data-test-selector="add_asset"]').should('be.disabled')
    cy.get('[data-test-selector="assetstable_row"]')
      .first()
      .click({ force: true })
    cy.get('[data-test-selector="form-submit"]').should('be.disabled')
  }

  selectUntaggedAssetPage = () => {
    openMyWorkModuleOnContextPanel()
    cy.get('[data-test-selector="untaggedassets_facility"]').click({ force: true })
  }

  addAsset = () => {
    cy.get('[data-test-selector="add_asset"]').click()
    this.assetForm.selectType('Amplifier')
    cy.get('[data-test-selector="assetform_dummydata"]').click()
    cy.get('[data-test-selector="ant_select_box"]')
      .first()
      .click()
    cy.get('ul')
      .last()
      .find('li')
      .contains('B')
      .click()
    cy.get('[data-test-selector="ant_year_picker"]')
      .clear()
      .type('2019')
  }

  openCamera = () => {
    cy.get('[data-test-selector="add-image-icon"]')
      .last()
      .click()
  }

  capturePhoto = () => {
    cy.get('[data-test-selector="camera-capture-button"]')
      .last()
      .click()
  }

  saveAsset = () => {
    cy.get('[data-test-selector="form-submit"]')
      .last()
      .click()
  }

  clickEditAsset = () => {
    cy.get('[data-test-selector="assetstable_row"]')
      .first()
      .click()
  }
}
