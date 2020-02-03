import { When, Then } from 'cucumber'
import customerHomePage from './customerHomePage.pageobj'

const currentComponent = new customerHomePage()

When('Home Page is loaded', () => {
  currentComponent.mount()
  currentComponent.initializeData()
})

Then('it should have correct analysis data', () => {
  currentComponent.checkChartData()
})
