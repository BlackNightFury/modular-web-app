import { When, Then, And } from 'cypress-cucumber-preprocessor/steps'
import shortid from 'shortid'
import {
  getCurrentPage,
  openMyWorkModuleOnContextPanel,
  loginAsSurveyor,
} from '../../../support'

const id = shortid.generate()

And('I’m logged in as a surveyor', () => {
  loginAsSurveyor()
})

When('I update a space', () => {
  getCurrentPage().updateSpace(id)
})

Then('the update should appear in the table', () => {
  const row = cy.get('[data-test-selector="spacestable_row"]').first()
  row.should('contain', `Test Space ${id}`)
  row.should('contain', `Test Local Space ${id}`)
  row.should('contain', 'Basement')
  row.should('contain', 'Done')
})

And('the update should sync to the database', () => {})

And('the floor should be shown in the context panel', () => {
  openMyWorkModuleOnContextPanel()
  cy.get('[data-test-selector="floor_link"]').should('exist')
})

When('the space is updated by other surveyors', () => {
  // This is to give enough margin to initiate subscription
  cy.wait(15000)

  cy.updateSpaceInFacility().then({ timeout: 10000 }, () => {})
})

Then('it should appear in the table', () => {
  cy.getSubscribedSpaceInfo().then(({ spaceName }) => {
    cy.get(`[data-test-selector="spacestable_name_${spaceName}"]`, { timeout: 15000 })
      .first()
      .should('exist')
  })
})
