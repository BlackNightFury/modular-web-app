export default class DataTable {
  selectCardView = () => {
    cy.get('[data-test-selector="cardswitch"]').first().click({ force: true })
  }
}
