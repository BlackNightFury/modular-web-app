import { when, then } from 'cypress-cucumber-preprocessor/steps'
import shortid from 'shortid'
import { navigateToFloor, getCurrentPage } from '../../../support'

let id

when('I create a floor', () => {
  id = shortid.generate()
  getCurrentPage().createFloor(id)
})

when('I create a floor with a reminder note', () => {
  id = shortid.generate()
  getCurrentPage().createFloor(id, { withReminder: true })
})

when('I create a floor with slashes in name', () => {
  id = shortid.generate()
  getCurrentPage().createFloor(id, { slashInName: true })
})

then('the floor should appear in the table', () => {
  const row = cy.get('[data-test-selector="floorstable_row"]').first()
  row.should('contain', `Test Floor ${id}`)
  row.should('contain', 'In Progress')
})

then('the floor with slash in name should appear in the table', () => {
  const row = cy.get('[data-test-selector="floorstable_row"]').first()
  row.should('contain', `Test Floor / ${id}`)
  row.should('contain', 'In Progress')
})

then('clicking the floor should show floor page', () => {
  navigateToFloor()
  cy.get('[data-test-selector="add_space"]')
    .first()
    .should('exist')
})

then('the floor should sync to the database', () => {
  //TODO : This needs to check that it's actually synched - would need to make a call to appsync, or dynamo...
})

when('the floor is created by other surveyors', () => {
  // This is to give enough margin to initiate subscription
  cy.wait(15000)

  cy.createFloorInFacility().then({ timeout: 10000 }, () => {})
})

then('it should appear in the table', () => {
  cy.getSubscribedFloorInfo().then(({ floorName, floorId }) => {
    const row = cy.get(`[data-test-record-id="${floorId}"]`, { timeout: 15000 }).first()
    row.should('contain', floorName)
    row.should('contain', 'In Progress')
  })
})
