import SurveyorHomePage from './surveyorHomePage'

export default class Header {
  navigateHome = () => {
    cy.get('[data-test-selector="home-link"]')
      .first()
      .click({ force: true })
    // .wait(2000)
    return new SurveyorHomePage()
  }
}
