import { When } from 'cucumber'
import AssetReplacementCost from './assetReplacementCost.pageobj'

const currentComponent = new AssetReplacementCost()

When('I go to asset replacement cost page', () => {
  currentComponent.mockCustomerLoggedIn()
  currentComponent.setGlobalStore()
})
