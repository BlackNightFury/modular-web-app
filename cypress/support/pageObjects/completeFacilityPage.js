import RightHandDrawer from './rightHandDrawer'
import { setCurrentPage } from '..'
import SurveyorHomePage from './surveyorHomePage'

export default class CompleteFacility {
  constructor() {
    this.rightHandDrawer = new RightHandDrawer()
  }

  disabledCompleteBtn = () =>
    cy
      .get('[data-test-selector="complete-facility-btn"]')
      .first()
      .should('be.disabled')

  enabledCompleteBtn = () =>
    cy
      .get('[data-test-selector="complete-facility-btn"]')
      .first()
      .should('be.enabled')

  fill = () => {
    cy.get('[data-test-selector*="form-checkbox"]').each($el => {
      cy.wait(200)
      cy.wrap($el).check()
    })
    cy.get('[data-test-selector*="form-multiline-text"]').each($el => {
      cy.wrap($el).type('Test')
    })
  }

  complete = () => {
    cy.get('[data-test-selector="complete-facility-btn"]')
      .first()
      .click()

    const homePage = new SurveyorHomePage()
    setCurrentPage(homePage)
    return homePage
  }

  saveCompleteFacilityProgress = () => {
    this.fill()
    cy.get('[data-test-selector="save-complete-facility-btn"]')
      .first()
      .click()
  }

  checkCompleteFacilityDetailsSaved = () => {
    cy.get('[data-test-selector*="form-multiline-text"]').each($el => {
      cy.wrap($el)
        .invoke('text')
        .then(text => {
          expect(text).to.eq('Test')
        })
    })
  }
}
