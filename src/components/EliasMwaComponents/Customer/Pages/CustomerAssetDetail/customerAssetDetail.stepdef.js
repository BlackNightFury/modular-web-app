import { When, Then } from 'cucumber'
import CustomerAssetDetail from './customerAssetDetail.pageobj'

const currentComponent = new CustomerAssetDetail()

When('I select asset with rating', () => {
  currentComponent.mount({ withRating: true })
})

Then('I should be able to see rating', () => {
  currentComponent.checkRating({ withRating: true })
})

When('I select asset without rating', () => {
  currentComponent.mount({ withRating: false })
})

Then('I should be able to see - as rating', () => {
  currentComponent.checkRating({ withRating: false })
})
