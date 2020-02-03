export default class CopyAssetsForm {
  allAssetsExist = () => {
    cy.get('.ant-row .ant-form-item').its('length').should('eq', 3)
    cy.get('[data-test-selector="Amplifier-40456"]').should('exist')
    cy.get('[data-test-selector="Audio Visual Equipment-40457"]').should('exist')
  }

  selectAssets = () => {
    cy.get('[data-test-selector="Amplifier-40456"]').click()
    cy.get('button[data-test-selector="form-submit"]').click()
    cy.wait(1000)
  }
}
  