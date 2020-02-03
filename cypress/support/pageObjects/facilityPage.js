import DataTable from './dataTable'
import ProfilePanel from './profilePanel'
import FloorPage from './floorPage'
import VirtualAssetsPage from './virtualAssetsPage'
import Header from './header'
import RightHandDrawer from './rightHandDrawer'
import LeftHandDrawer from './leftHandDrawer'
import GlobalMessagePanel from './globalMessagePanel'

export default class FacilityPage {
  constructor() {
    this.profilePanel = new ProfilePanel()
    this.dataTable = new DataTable()
    this.header = new Header()
    this.rightHandDrawer = new RightHandDrawer()
    this.leftHandDrawer = new LeftHandDrawer()
    this.globalMessagePanel = new GlobalMessagePanel()
  }

  selectFloor = () => {
    cy.get('[data-test-selector="floorstable_action_link"]', { timeout: 10000 })
      .first()
      .click({ force: true })
    // .wait(1000)
    return new FloorPage()
  }

  selectVirtualAssetsForFloor = () => {
    cy.get('[data-test-selector="floorstable_row"]')
      .first()
      .find('[data-test-selector="floorstable_action_dropdown"]')
      .click()
    cy.get('li')
      .contains('Virtual assets')
      .click()

    return new VirtualAssetsPage()
  }

  createFloor = (id, options) => {
    const floorName = options && options.slashInName ? `Test Floor / ${id}` : `Test Floor ${id}`

    cy.get('[data-test-selector="add_floor"]').click({ force: true })
    cy.get('[data-test-selector="FloorForm_name"]').type(floorName)
    cy.get('[data-test-selector="FloorForm_status"]').click()
    cy.get('li')
      .contains('In Progress')
      .click()
    if (options && options.withReminder) {
      cy.get('[data-test-selector="reminder_checkbox"]').click()
      cy.get('[data-test-selector="reminder_notes"]').type(`Test Reminder Notes ${id}`)
    }
    cy.get('[data-test-selector="floor-form-submit"]')
      .last()
      .click({ force: true })
  }

  updateFloor = id => {
    cy.get('[data-test-selector="floorstable_row"]')
      .first()
      .click({ force: true })
    cy.get('[data-test-selector="FloorForm_name"]')
      .last()
      .clear()
      .type(`Test Floor ${id}`)
    cy.get('[data-test-selector="FloorForm_status"]')
      .last()
      .click()
    cy.get('ul')
      .last()
      .find('li')
      .contains('Not Started')
      .click()
    cy.get('[data-test-selector="floor-form-submit"]')
      .last()
      .click()
  }

  startCompleteFloorProcess = () => {
    cy.get('[data-test-selector="floorstable_row"]')
      .first()
      .find('[data-test-selector="floorstable_action_dropdown"]')
      .click()
    cy.get('li')
      .contains('Complete')
      .click()
  }

  completeFloor = () => {
    cy.get('[data-test-selector="complete-floor-checkbox"]').click()
    cy.get('[data-test-selector="complete-floor-submit"]').click()
  }

  updateSpaceStatusToDone = () => {
    cy.get('[data-test-selector="complete-floor-drawer"] .ant-collapse-header')
      .first()
      .click()
    cy.get('[data-test-selector="space-in-complete-floor"]').click()
    cy.get('[data-test-selector="spaceform_status"]')
      .last()
      .click()
    cy.get('ul')
      .last()
      .find('li')
      .contains('Done')
      .click()
    cy.get('[data-test-selector="form-submit"]')
      .last()
      .click()
  }

  checkIfReadOnly = readOnly => {
    if (readOnly) {
      cy.get('[data-test-selector="add_floor"]').should('be.disabled')
    } else {
      cy.get('[data-test-selector="add_floor"]').should('be.enabled')
    }
    cy.get('[data-test-selector="floorstable_row"]')
      .first()
      .click({ force: true })

    if (readOnly) {
      cy.get('[data-test-selector="floor-form-submit"]').should('be.disabled')
    } else {
      cy.get('[data-test-selector="floor-form-submit"]').should('be.enabled')
    }
    cy.get('[data-test-selector="floor-form-cancel"]')
      .first()
      .click()
  }

  clickEditFacility = () => {
    cy.get('[data-test-selector="facility-page-secondary-dropdown"]')
      .first()
      .click()
    cy.get('[data-test-selector="edit_facility_button"]')
      .first()
      .click()
  }

  checkEditFacilityDrawerShown = () => {
    cy.get('[data-test-selector="edit-facility-drawer"]').should('exist')
  }
}
