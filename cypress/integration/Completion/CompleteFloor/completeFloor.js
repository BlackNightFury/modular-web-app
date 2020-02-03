import { when, then, and } from 'cypress-cucumber-preprocessor/steps'
import { getCurrentPage } from '../../../support'

when('I start the complete floor process', () => {
  getCurrentPage().startCompleteFloorProcess()
})

when('I complete a floor in context panel', () => {
  getCurrentPage().completeFloorInContextPanel()
})

when('I update the space status to done', () => {
  getCurrentPage().updateSpaceStatusToDone()
})

and('I submit the complete floor form', () => {
  getCurrentPage().completeFloor()
})

then('the done floor should appear in the table', () => {
  const row = cy.get('[data-test-selector="floorstable_row"]').first()
  row.should('contain', 'Done')
})

then('I should be taken to the facility page', () => {
  cy.location('pathname').should('match', /^\/data-collection\/[^/]+\/facilities\/[^/]+$/i)
})

then('the floor completion drawer should be shown', () => {
  cy.get('[data-test-selector="complete-floor-drawer"]').should('exist')
})
