import { given, when, then, and } from 'cypress-cucumber-preprocessor/steps'
import {
  loginAsSurveyor,
  loginAsGlobalSurveyor,
  logout,
  getCurrentPage,
  navigateToFacility,
  navigateToFloor,
  navigateToSpace,
  navigateToVirtualAssetsPage,
  loginAsCustomer,
} from '../../support'

given('I’m logged in as a surveyor', () => {
  loginAsSurveyor()
})

and('I’m logged in as a surveyor', () => {
  loginAsSurveyor()
})

and("I'm logged in as a surveyor", () => {
  loginAsSurveyor()
})

given('I’m logged in as a testTenant surveyor', () => {
  loginAsSurveyor()
})

given('I’m logged in as a global surveyor', () => {
  loginAsGlobalSurveyor()
})

given('I’m logged in as a customer', () => {
  loginAsCustomer()
})

given("I've navigated to the facility page", () => {
  navigateToFacility({ autoCompletePSQ: true })
})

and("I've navigated to the facility page", () => {
  navigateToFacility({ autoCompletePSQ: true })
})

given("I've navigated to the floor page", () => {
  navigateToFloor()
})

and("I've navigated to the floor page", () => {
  navigateToFloor()
})

given("I've navigated to the space page", () => {
  navigateToSpace()
})

given("I've navigated to the virtual asset page", () => {
  navigateToVirtualAssetsPage()
})

when('I log out', () => {
  logout()
})

then('local storage should be empty', () => {
  getCurrentPage().checkLocalStorage()
})

when('I switch to card view', () => {
  getCurrentPage().dataTable.selectCardView()
})

given('a virtual asset exists', () => {
  cy.createVirtualAsset()
})

given('an asset exists', () => {
  cy.createAsset()
})

given('a space exists', () => {
  cy.createSpace().then({ timeout: 10000 }, () => {})
})

given('a floor exists', () => {
  cy.createFloor().then({ timeout: 10000 }, () => {})
})

given('a facility exists', () => {
  cy.createFacility()
})
