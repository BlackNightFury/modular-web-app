import { When, Then } from 'cucumber'
import CustomerMyStateAssets from './customerAsset.pageobj'

const currentComponent = new CustomerMyStateAssets()

When('I go to my estate asset page', () => {
  currentComponent.mockCustomerLoggedIn()
  currentComponent.setGlobalStore()
})

Then('the breadcrumb should be correct', () => {
  currentComponent.mountTopBar()
  currentComponent.checkBreadcrumb()
})

When('I choose Virtual for filter option', () => {
  currentComponent.mount()
  currentComponent.changeFilterOption(['Class-Virtual'])
})

Then('only virtual assets should be listed', () => {
  currentComponent.checkIfFilteredByVirtual()
})

When('I choose Qty Ascending for sort option', () => {
  currentComponent.changeFilterOption([])
  currentComponent.changeSortOption('facets.quantity')
})

Then('assets list should be sorted', () => {
  currentComponent.checkIfSortedByQty()
})
