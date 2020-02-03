import { When, Then, And } from 'cypress-cucumber-preprocessor/steps'
import { 
  navigateToFloor,
  openMyWorkModuleOnContextPanel,
  loginAsSurveyor,
} from '../../../support'

And('I’m logged in as a surveyor', () => {
  loginAsSurveyor()
})

When("I've navigated to the floor page", () => {
    navigateToFloor()
})

then('the cardview should be displayed', () => {
  cy.get('[data-test-selector="spacescardlist_column"]').should('exist')
  cy.get('[data-test-selector="spacescardlist_card"]').should('exist')
})

Then('the floor should be shown in the context panel', () => {
  openMyWorkModuleOnContextPanel()
  cy.get('[data-test-selector="floor_link"]').should('exist')
})

When('I favourite a space', () => {
  cy.get('[data-test-selector="spacestable_action_dropdown"]')
    .first()
    .click()
  cy.get('[data-test-selector="favorite_space_action"]')
    .first()
    .click()
})

And('the favourite space should be present in my favourites', () => {
  cy.get('[data-test-selector="select_location"] .ant-select').click()
  cy.get('.ant-select-tree-treenode-switcher-close:first-child .ant-select-tree-switcher')
    .should('have.class', 'ant-select-tree-switcher_close')
})

When("I navigate back to the facility page", () => {
  cy.get('[data-test-selector="breadcrumb-text"]').first().click()
})

Then('the facility should be shown in the context panel', () => {
  openMyWorkModuleOnContextPanel()
  cy.get('[data-test-selector="facility_link"]').should('exist')
})

And("I open the my work module", () => {
  openMyWorkModuleOnContextPanel()
})

Then('my work module should remain open', () => {
  cy.get('[data-test-selector="facility_link"]').should('exist')
})

When("I navigate to the home page", () => {
  cy.get('[data-test-selector="home-link"]').click()
})

And("I navigate to the facility page", () => {
  cy.get('[data-test-selector="facilitiestable_action_button"]').last().click()
})

And('I try to delete a space', () => {
  cy.get('[data-test-selector="spacestable_action_dropdown"]')
    .first()
    .click()
  cy.get('[data-test-selector="delete_space_action"]')
    .first()
    .click()
})

Then('delete space warning message appears', () => {
  cy.get('[data-test-selector="delete_space_confirm_title"]').should('exist')
})

When("I continue delete", () => {
  cy.get('[data-test-selector="delete_space_confirm_checkbox"]').check()
  cy.get('[data-test-selector="delete_space_confirm_button"]')
    .click({ force: true })
})

Then('The space should disappear in the table', () => {
  cy.get('[data-test-selector="spacestable_row"]').should('have.length', 0)
})