import { When, Then } from 'cucumber'
import CustomerMyEstateFacility from './customerFacility.pageobj'

const currentComponent = new CustomerMyEstateFacility()

When('I go to the facilities page', () => {
  currentComponent.mockCustomerLoggedIn()
  currentComponent.setGlobalStore()
})

Then('the facilities breadcrumb should be shown', () => {
  currentComponent.mountTopBar()
  currentComponent.checkBreadcrumb()
})

When('I filter on not started', () => {
  currentComponent.mount()
  currentComponent.changeFilterOption(['NOT_STARTED'])
})

Then('the facilities list should be filtered by not started', () => {
  currentComponent.checkIfFilteredByNotStarted()
})

When('I sort by assets', () => {
  currentComponent.changeFilterOption([])
  currentComponent.changeSortOption('assets')
})

Then('the facilities list should be sorted by assets', () => {
  currentComponent.checkIfSortedByAssets()
})
