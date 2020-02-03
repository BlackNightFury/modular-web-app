export default class PreSurveyorQuestionnaire {
  exist = () =>
    cy.get('.ant-drawer-open [data-test-selector="new_facility_questionnaire"]').should('exist')

  notExist = () =>
    cy.get('.ant-drawer-open [data-test-selector="new_facility_questionnaire"]').should('not.exist')

  clickCancel = () =>
    cy
      .get('[data-test-selector="form-cancel"]')
      .first()
      .click()
  // .wait(1000)

  complete = () => {
    cy.get('[data-test-selector="new_facility_questionnaire"] [type="checkbox"]')
      .first()
      .check()
    cy.get('[data-test-selector="new_facility_questionnaire"] [type="checkbox"]')
      .last()
      .check()
    cy.get('button[data-test-selector="form-submit"]').click()
  }
}
