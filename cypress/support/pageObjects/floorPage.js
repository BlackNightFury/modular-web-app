import ProfilePanel from './profilePanel'
import SpacePage from './spacePage'
import DataTable from './dataTable'
import Header from './header'
import RightHandDrawer from './rightHandDrawer'
import GlobalMessagePanel from './globalMessagePanel'
import { openMyWorkModuleOnContextPanel } from '..'

export default class FloorPage {
  constructor() {
    this.profilePanel = new ProfilePanel()
    this.dataTable = new DataTable()
    this.rightHandDrawer = new RightHandDrawer()
    this.header = new Header()
    this.globalMessagePanel = new GlobalMessagePanel()
  }

  selectSpace = () => {
    cy.get('[data-test-selector="spacestable_action_link"]')
      .first()
      .click({ force: true })

    return new SpacePage()
  }

  createSpace = (id, options) => {
    cy.get('[data-test-selector="add_space"]')
      .click()
    cy.get('[data-test-selector="spaceform_name"]').type(`Test Space ${id}`)
    cy.get('[data-test-selector="spaceform_localname"]').type(`Test Local Space ${id}`)
    cy.get('[data-test-selector="spaceform_type"]').click()
    cy.get('li')
      .contains('Accommodation')
      .click()
    cy.get('[data-test-selector="spaceform_status"]').click()
    cy.get('li')
      .contains('Not started')
      .click()
    if (options && options.withReminder) {
      cy.get('[data-test-selector="reminder_checkbox"]').click()
      cy.get('[data-test-selector="reminder_notes"]').type(`Test Reminder Notes ${id}`)
    }
    if (options && options.addAsset) { //Click dropdown and add asset
      cy.get('[data-test-selector="spaceform_multiactionopen"]').last().click()
      cy.get('[data-test-selector="spaceform_saveandaddasset"]').last().click()
    } else {
      cy.get('[data-test-selector="form-submit"]').click()
    }
    // .wait(2000)
  }

  updateSpace = id => {
    cy.get('[data-test-selector="spacestable_row"]')
      .first()
      .click({ force: true })
    cy.get('[data-test-selector="spaceform_name"]')
      .last()
      .clear()
      .type(`Test Space ${id}`)
    cy.get('[data-test-selector="spaceform_localname"]')
      .last()
      .clear()
      .type(`Test Local Space ${id}`)
    cy.get('[data-test-selector="spaceform_type"]')
      .last()
      .click()
    cy.get('ul')
      .last()
      .find('li')
      .contains('Basement')
      .click()
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

  checkReadOnly = () => {
    cy.get('[data-test-selector="add_space"]').should('be.disabled')
    cy.get('[data-test-selector="spacestable_row"]')
      .first()
      .click({ force: true })
    cy.get('[data-test-selector="form-submit"]').should('be.disabled')
  }

  completeFloorInContextPanel =  () => {
    openMyWorkModuleOnContextPanel()
    cy.get('[data-test-selector="context-panel-complete-floor"]').click()
    cy.get('[data-test-selector="complete-floor-checkbox"]').click()
    cy.get('[data-test-selector="complete-floor-submit"]').click()
  }
}
