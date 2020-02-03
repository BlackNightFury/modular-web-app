// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'
// Alternatively you can use CommonJS syntax:
// require('./commands')
// import { before, beforeEach, beforeEach } from "cypress-cucumber-preprocessor/steps";
import LoginPage from './pageObjects/loginPage'
import SurveyorHomePage from './pageObjects/surveyorHomePage'
import FacilityPage from './pageObjects/facilityPage'
import FloorPage from './pageObjects/floorPage'
import ConfirmPrompt from './pageObjects/confirmPrompt'
import CompleteFacilityPage from './pageObjects/completeFacilityPage'

let currentPage = null
let isFailed = false

Cypress.on('uncaught:exception', err => {
  // Cannot read property 'status' of undefined
  // This error comes from New Relic in Cypress
  // Need to research and fix it
  // Now we skip this error in Cypress
  // eslint-disable-next-line
  console.log(err)
  return false
})

const completePSQ = currentPg => {
  cy.get('.ant-drawer-open [data-test-selector="new_facility_questionnaire"]', {
    timeout: 10000,
  })
    .should('exist')
    .then(() => {
      if (currentPg.rightHandDrawer) {
        currentPg.rightHandDrawer.preSurveyorQuestionnaire.complete()
      }
    })
}

export const getCurrentPage = () => currentPage

export const setCurrentPage = page => {
  currentPage = page
}

function login(email, password) {
  currentPage = new LoginPage()
  currentPage = currentPage.login(email, password)
}

export const loginAsSurveyor = () => {
  login('surveyor@testtenant.com', 'Realm34$')
}

export const loginAsGlobalSurveyor = () => {
  login('surveyor@realestateams.com', 'Realm34$')
}

export const loginAsSurveyorToTentantWithVAAtSpace = () => {
  login('surveyor@edgehill.co.uk', 'Realm34$')
}

export const loginAsSurveyorToPrototype = () => {
  login('surveyor-cp@realestateams.com', 'Realm34$')
}

export const loginAsCustomer = () => {
  login('customer@testtenant.com', 'Realm34$')
}

export const loginAsCustomerToPrototype = () => {
  login('customer-cp@realestateams.com', 'Realm34$')
}

export const logout = () => {
  if (!(currentPage instanceof LoginPage)) {
    currentPage.profilePanel.logout()
    cy.get('body').then($body => {
      if ($body.find('[data-test-selector="profile_logout_confirm_title"]').length) {
        new ConfirmPrompt().accept()
      }
    })
    currentPage = new LoginPage()
  }
}

export const navigateToHomePage = () => {
  currentPage = currentPage.header.navigateHome()
  return currentPage
}

export const navigateToFacility = options => {
  if (!(currentPage instanceof SurveyorHomePage)) {
    throw 'No idea where we are. Something has gone wrong!'
  }

  const { autoCompletePSQ, selectFirstRow } = options
  currentPage = currentPage.selectFacility(selectFirstRow)
  cy.wait(1000)
  if (autoCompletePSQ) {
    completePSQ(currentPage)
  }
}

export const navigateToCompleteFacilityPage = () => {
  currentPage = new CompleteFacilityPage()
}

export const navigateToFloor = () => {
  if (!(currentPage instanceof FacilityPage)) {
    navigateToFacility({ autoCompletePSQ: true })
  }
  currentPage = currentPage.selectFloor()
}

export const navigateToSpace = () => {
  if (!(currentPage instanceof FloorPage)) {
    navigateToFloor()
  }
  currentPage = currentPage.selectSpace()
}

export const navigateToVirtualAssetsPage = () => {
  if (!(currentPage instanceof FacilityPage)) {
    navigateToFacility({ autoCompletePSQ: true })
  }
  currentPage = currentPage.selectVirtualAssetsForFloor()
}

export const navigateToMyEstateAssetsPage = () => {
  currentPage = currentPage.goToMyEstateAssetsPage()
}

export const navigateToMyEstateFacilitiesPage = () => {
  currentPage = currentPage.goToMyEstateFacilitiesPage()
}

export const navigateToAssetReplacementCostPage = () => {
  currentPage = currentPage.goToAssetReplacementCostPage()
}

export const navigateToAssetManagementDashboardPage = () => {
  currentPage = currentPage.goToAssetManagementDashboardPage()
}

export const navigateToLifeCycleDashboardPage = () => {
  currentPage = currentPage.goToLifeCycleDashboardPage()
}

export const shouldBeOn = url => {
  cy.location('pathname').should('eq', url)
}

export const openMyWorkModuleOnContextPanel = () => {
  cy.get('body').then($body => {
    if (!$body.find('[data-test-selector="facility_link"]').length) {
      cy.get('[data-test-selector="contextpanel_work_link"]').click({ force: true })
    }
  })
}

before(() => {
  cy.log('Will run once before all tests', currentPage)
  Cypress.on('fail', error => {
    isFailed = true
    throw error
  })

  Cypress.on('window:before:load', win => {
    win.indexedDB.deleteDatabase('firebaseLocalStorageDb')
    win.indexedDB.deleteDatabase('modular-web-app')
    win.indexedDB.deleteDatabase('modular-web-app-precache')
  })
})

beforeEach(() => {
  cy.log('This will run before each test', currentPage)
  isFailed = false
  // currentPage = new LoginPage()
  cy.visit('/')
  cy.window().then(win => {
    cy.configureAmplify(win.mwa_config)
  })
})

afterEach(() => {
  cy.log('This will run after each test', currentPage)
  if (isFailed) {
    Cypress.runner.stop()
  }
  // if (currentPage && currentPage.profilePanel) currentPage.profilePanel.logout()
})
