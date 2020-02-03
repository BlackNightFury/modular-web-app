import { when, then, and } from 'cypress-cucumber-preprocessor/steps'
import {
  navigateToFacility,
  getCurrentPage,
  navigateToHomePage,
  navigateToFloor,
  navigateToSpace,
} from '../../../support'

when('I complete the facility', () => {
  navigateToFacility({ autoCompletePSQ: true })
  let currentPage = navigateToHomePage()
  currentPage = currentPage.clickCompleteFacility()
  currentPage.fill()
  currentPage = currentPage.complete()
})

then('the facility should be readonly', () => {
  const currentPage = getCurrentPage()
  currentPage.clickOnFacility()
  currentPage.checkEditFacilityDrawerDisabled()
})

and('I should be able to select a floor', () => {
  navigateToFacility({ autoCompletePSQ: false })
})

and('the floor should be readonly', () => {
  getCurrentPage().checkIfReadOnly(true)
})

and('I should be able to select a space', () => {
  navigateToFloor({ autoCompletePSQ: false })
})

and('the space should be readonly', () => {
  getCurrentPage().checkReadOnly()
})

and('I should be able to select an asset', () => {
  navigateToSpace({ autoCompletePSQ: false })
})

and('the asset should be readonly', () => {
  getCurrentPage().checkReadOnly()
})
