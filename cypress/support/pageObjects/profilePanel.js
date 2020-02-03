export default class ProfilePanel {
  logout = () =>
    cy.get('[data-test-selector="profile_avatar"]').then($link => {
      cy.log('got element', $link)
      if ($link) {
        $link.click()

        cy.get('[data-test-selector="profile_logout_button"]')
          .click({ force: true })
          .wait(2000)
      }
    })
}
