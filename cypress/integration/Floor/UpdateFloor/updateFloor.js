import { when, then } from 'cypress-cucumber-preprocessor/steps'
import shortid from 'shortid'
import { getCurrentPage } from '../../../support'

let id

when('I update a floor', () => {
  id = shortid.generate()
  getCurrentPage().updateFloor(id)
})

then('the update should appear in the table', () => {
  const row = cy.get('[data-test-selector="floorstable_row"]').first()
  row.should('contain', `Test Floor ${id}`)
  row.should('contain', 'Not Started')
})

then('the update should sync to the database', () => {
  //TODO : This needs to check that it's actually synched - would need to make a call to appsync, or dynamo...
})

when('the floor is updated by other surveyors', () => {
  // This is to give enough margin to initiate subscription
  cy.wait(15000)

  cy.updateFloorInFacility().then({ timeout: 10000 }, () => {})
})

then('it should appear in the table', () => {
  cy.getSubscribedFloorInfo().then(({ floorName }) => {
    cy.get(`[data-test-selector="floorstable_name_${floorName}"]`, { timeout: 15000 })
      .first()
      .should('exist')
  })
})
