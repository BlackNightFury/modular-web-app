import moment from 'moment'
import ProfilePanel from './profilePanel'
import FacilityPage from './facilityPage'
import DataTable from './dataTable'
import { setCurrentPage } from '..'
import RightHandDrawer from './rightHandDrawer'
import CompleteFacilityPage from './completeFacilityPage'

export default class SurveyorHomePage {
  constructor() {
    this.profilePanel = new ProfilePanel()
    this.dataTable = new DataTable()
    this.rightHandDrawer = new RightHandDrawer()
  }

  selectCardView = () => {
    cy.get('[data-test-selector="cardswitch"]').click()
  }

  selectFacility = selectFirstRow => {
    cy.getFacilityId().then(facilityId => {
      const rows = cy.get('[data-test-selector="facilitiestable_row"]', { timeout: 10000 })
      let row
      if (selectFirstRow) {
        row = rows.first()
      } else {
        row = rows.contains(`TESTING FACILITY${facilityId}`).parent()
      }
      row.find('[data-test-selector="facilitiestable_action_button"]').click({ force: true })
    })

    return new FacilityPage()
  }

  clickOnFacility = () => {
    cy.get('[data-test-selector="facilitiestable_row"]')
      .first()
      .click()
  }

  clickCompleteFacility = () => {
    cy.getFacilityId().then(facilityId => {
      cy.get('[data-test-selector="facilitiestable_row"]')
        .contains(`TESTING FACILITY${facilityId}`)
        .parent()
        .find('[data-test-selector="facilitiestable_action_dropdown"]')
        .click({ force: true })
      cy.get('li[data-test-selector="complete_facility_link"]').click({ force: true })
    })
    const completeFacilityPage = new CompleteFacilityPage()
    setCurrentPage(completeFacilityPage)
    return completeFacilityPage
  }

  checkDateTimeStringENUS = () => {
    cy.get('[data-test-selector="facilitiestable_row"]')
      .first()
      .find('td')
      .eq(5)
      .invoke('text')
      .then(text => {
        const aDate = moment(text, ['MM/DD/YYYY h:m A'], true)
        expect(aDate.isValid()).equal(true)
      })
  }

  checkDateTimeStringENGB = () => {
    cy.get('[data-test-selector="facilitiestable_row"]')
      .first()
      .find('td')
      .eq(5)
      .invoke('text')
      .then(text => {
        const aDate = moment(text, ['DD/MM/YYYY HH:mm'], true)
        expect(aDate.isValid()).equal(true)
      })
  }

  checkCompletionGlobalMessage = isShown => {
    if (isShown) {
      cy.get('[data-test-selector="completion-warning-card"]', { timeout: 10000 }).should('exist')
    } else {
      cy.get('[data-test-selector="completion-warning-card"]').should('not.exist')
    }
  }

  selectFacilityMultiActionButton = () => {
    cy.get('[data-test-selector="facilitiestable_action_dropdown"]')
      .first()
      .click()
  }

  checkFacilityActionList = () => {
    cy.get('[data-test-selector="facility-action-dropdown"]').should('exist')
  }

  clickEditFacility = () => {
    cy.get('[data-test-selector="edit_facility_action"]')
      .first()
      .click()
  }

  checkEditFacilityDrawerShown = () => {
    cy.get('[data-test-selector="edit-facility-drawer"]').should('exist')
  }

  checkEditFacilityDrawerDisabled = () => {
    cy.get('[data-test-selector="facility-form-submit"]')
      .first()
      .should('be.disabled')
  }

  checkEditFacilityDrawerEnabled = () => {
    cy.get('[data-test-selector="facility-form-submit"]')
      .first()
      .should('be.enabled')
  }

  checkPSQWarningCardVisible = () => {
    cy.get('[data-test-selector="show-facility-psq-link"]')
      .first()
      .should('exist')
  }

  clickPSQLink = () => {
    cy.get('[data-test-selector="show-facility-psq-link"]')
      .first()
      .click()
  }

  refreshKnownIssues = () => {
    cy.get('[data-test-selector="refresh"]').click()
  }

  checkKnownIssuesShown = () => {
    cy.get('[data-test-selector="knownissuestable_row"]')
      .its('length')
      .should('be.gte', 2)
  }

  updateFacility = () => {
    cy.fixture('amazon.jpg').then(fileContent => {
      cy.get('input[type=file]').upload(
        {
          fileContent,
          fileName: 'test.jpg',
          mimeType: 'image/jpeg',
        },
        { subjectType: 'input' },
      )
    })
    cy.get('[data-test-selector="form-multiline-text_facets.postcode"]')
      .clear()
      .type('00000')
    cy.get('[data-test-selector="facility-form-submit"]')
      .first()
      .click({ force: true })
  }
}
