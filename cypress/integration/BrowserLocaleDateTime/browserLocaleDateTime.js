import { when, then, and } from 'cypress-cucumber-preprocessor/steps'
import { getCurrentPage, navigateToFacility, navigateToHomePage } from '../../support'

when('I set browser locale as en-US', () => {
  cy.window().then(win => {
    win.navigator.userLanguage = 'en-US'
  })
})

and('I refresh the page', () => {
  navigateToFacility({ selectFirstRow: true })
  navigateToHomePage()
})

then('all datetime strings should appear based en-US datetime format', () => {
  getCurrentPage().checkDateTimeStringENUS()
})

when('I set browser locale as en-GB', () => {
  cy.window().then(win => {
    win.navigator.userLanguage = 'en-GB'
  })
})

then('all datetime strings should appear based en-GB datetime format', () => {
  getCurrentPage().checkDateTimeStringENGB()
})
