import { When, Then, And } from 'cypress-cucumber-preprocessor/steps'
import shortid from 'shortid'
import { getCurrentPage, openMyWorkModuleOnContextPanel, loginAsSurveyor } from '../../../support'

const id = shortid.generate()

And('I’m logged in as a surveyor', () => {
  loginAsSurveyor()
})

When('I create a space', () => {
  getCurrentPage().createSpace(id)
})

When('I create a space with a reminder note', () => {
  getCurrentPage().createSpace(id, { withReminder: true })
})

Then('the space should appear in the table', () => {
  const row = cy.get('[data-test-selector="spacestable_row"]').first()
  row.should('contain', `Test Space ${id}`)
  row.should('contain', `Test Local Space ${id}`)
  row.should('contain', 'Accommodation')
  row.should('contain', 'Not Started')
})

And('the space should sync to the database', () => {})

And('the floor should be shown in the context panel', () => {
  openMyWorkModuleOnContextPanel()
  cy.get('[data-test-selector="floor_link"]').should('exist')
})

When('I use the "create new space and add asset" action', () => {
  getCurrentPage().createSpace(id, { addAsset: true })
})

Then('the user should be taken to the space', () => {
  cy.url().should('include', '/spaces/')
})

And('the add asset dialogue should be shown', () => {
  cy.get('[data-test-selector="addassetpanel"]').should('exist')
})

When('the space is created by other surveyors', () => {
  // This is to give enough margin to initiate subscription
  cy.wait(15000)

  cy.createSpaceInFacility().then({ timeout: 10000 }, () => {})
})

Then('it should appear in the table', () => {
  cy.getSubscribedSpaceInfo().then(({ spaceName, spaceId }) => {
    const row = cy.get(`[data-test-record-id="${spaceId}"]`, { timeout: 15000 }).first()
    row.should('contain', spaceName)
    row.should('contain', 'In Progress')
  })
})
