export default class ConfirmPrompt {
  accept = () => {
    cy.get('[data-test-selector="understand_logout_checkbox"]').check()
    cy.get('[data-test-selector="logout_and_delete_data"]')
      .click({ force: true })
      .wait(2000)
  }
}
