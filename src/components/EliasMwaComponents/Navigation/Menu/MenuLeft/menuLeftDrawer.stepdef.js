import { When, Then } from 'cucumber'
import MenuLeftDrawer from './menuLeftDrawer.pageobj'

const currentComponent = new MenuLeftDrawer()
When('I log in as customer', () => {
  currentComponent.mockCustomerLoggedIn()
  currentComponent.setGlobalStore()
})

Then('I should see the client context panel', () => {
  currentComponent.mountWithProvider()
  currentComponent.checkIfCustomerMenuLeftDrawer()
})

When('I log in as surveyor', () => {
  currentComponent.mockSurveyorLoggedIn()
  currentComponent.setGlobalStore()
  currentComponent.mountWithProvider()
})

Then('I should see myestate assets page panel', () => {
  currentComponent.checkIfMyEstateAssetsPagePanel()
})

When('I click myestate assets page panel', () => {
  currentComponent.clickMyEstateAssetsPagePanel()
})

Then('I should be taken to myestate assets page', () => {
  currentComponent.checkHistory('/my-estate/assets')
})
