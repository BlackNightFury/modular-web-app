import { given, when, then } from 'cypress-cucumber-preprocessor/steps'
import shortid from 'shortid'

import { logout, getCurrentPage, loginAsSurveyor, loginAsCustomer } from '../../support'

when("I'm logged in as a user", () => {
  loginAsSurveyor()
})

then('the tables should have proper styles', () => {
  const cardBodyComponent = cy.get('.card-body div').first()
  cardBodyComponent.should('have.css', 'padding-right', '0px')
  cardBodyComponent.should('have.css', 'padding-left', '0px')
  
  cy.get('.ant-layout-content')
    .first()
    .should('have.css', 'background-image', 'linear-gradient(to right bottom, rgb(243, 246, 247), rgb(255, 255, 255), rgb(255, 255, 255), rgb(255, 255, 255))')
})

when("I'm logged in as a surveyor", () => {
  loginAsSurveyor()
})

then('I should be redirected to surveyor home page', () => {
  cy.location('pathname').should('eq', '/data-collection/home')
})

when("I'm logged in as a customer", () => {
  loginAsCustomer()
})

then('I should be redirected to customer home page', () => {
  // cy.location('pathname').should('eq', '/home')
  // This is just for CBRE DEMO, need to change after the demo
  cy.location('pathname').should('eq', '/analytics/asset-management')
})

given("I've done some work", () => {
  getCurrentPage().createFloor(shortid.generate())
})

when('I log out', () => {
  logout()
})
