import { when, then } from 'cypress-cucumber-preprocessor/steps'

then('the floor cardview should be displayed', () => {
  cy.get('[data-test-selector="floorscardlist_column"]').should('exist')
  cy.get('[data-test-selector="floorscardlist_card"]').should('exist')
})

when('I try to delete a floor', () => {
  cy.get('[data-test-selector="floorstable_action_dropdown"]')
    .first()
    .click()
  cy.get('[data-test-selector="delete_floor_button"]')
    .first()
    .click()
})

then('delete floor warning message appears', () => {
  cy.get('[data-test-selector="delete_floor_confirm_title"]').should('exist')
})

when("I continue delete", () => {
  // cy.get('[data-test-selector="delete_floor_confirm_checkbox"]').check()
  cy.get('[data-test-selector="delete_floor_confirm_button"]')
    .click({ force: true })
})

then('The floor should disappear in the table', () => {
  cy.get('[data-test-selector="floorstable_row"]').should('have.length', 0)
})