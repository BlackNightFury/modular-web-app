export default class PSQRequiredWarning {
  clickShowPSQ = () => {
    cy.get('[data-test-selector="show-facility-psq-link"]')
      .first()
      .click({ force: true })
  }
}
