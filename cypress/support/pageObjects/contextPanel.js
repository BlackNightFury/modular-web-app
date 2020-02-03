import { navigateToCompleteFacilityPage, openMyWorkModuleOnContextPanel } from '..'

export default class ContextPanel {
  existCompleteFacility = () => {
    openMyWorkModuleOnContextPanel()
    cy.get('[data-test-selector="context-panel-complete-facility"]').should('exist')
  }

  goToCompleteFacility = () => {
    openMyWorkModuleOnContextPanel()
    cy.get('[data-test-selector="context-panel-complete-facility"]')
      .first()
      .click()
    navigateToCompleteFacilityPage()
  }

  selectSourceSpace = () => {
    openMyWorkModuleOnContextPanel()
    cy.get('[data-test-selector="select_location"]').find('span').eq(0).click()
    cy.getSourceSpaceInfo().then(({facilityId, floorId, spaceId}) => {
      cy.contains(`Testing facility${facilityId.toLowerCase()}`).parent().parent().parent().find('span').eq(0).click({force: true})
      cy.contains(`Testing floor${floorId.toLowerCase()}`).parent().parent().parent().find('span').eq(0).click({force: true})
      cy.contains(`Testing space${spaceId.toLowerCase()}`).click({force: true})
    })
  }

  selectCopyAssets = () => {
    cy.get('button[data-test-selector="search_action_dropdown"]').click()
    cy.contains('Copy assets').click()
  }

  navigateToProjectDoc = () => {
    openMyWorkModuleOnContextPanel()
    cy.get('[data-test-selector="contextpanel_project_docs"]')
      .first()
      .invoke('attr', 'href')
      .as('project_doc_href')
  }
}
