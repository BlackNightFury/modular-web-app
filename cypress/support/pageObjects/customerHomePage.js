import ProfilePanel from './profilePanel'
import LeftHandDrawer from './customerLeftHandDrawer'

export default class CustomerHomePage {
  constructor() {
    this.profilePanel = new ProfilePanel()
    this.leftHandDrawer = new LeftHandDrawer()
  }

  goToMyEstateAssetsPage = () => this.leftHandDrawer.goToMyEstateAssetsPage()

  goToMyEstateFacilitiesPage = () => this.leftHandDrawer.goToMyEstateFacilitiesPage()

  goToAssetReplacementCostPage = () => this.leftHandDrawer.goToAssetReplacementCostPage()

  goToAssetManagementDashboardPage = () => this.leftHandDrawer.goToAssetManagementDashboardPage()

  goToLifeCycleDashboardPage = () => this.leftHandDrawer.goToLifeCycleDashboardPage()
}
