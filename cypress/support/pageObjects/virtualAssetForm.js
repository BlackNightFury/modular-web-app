import AssetForm from './AssetForm'

export default class VirtualAssetForm {
  constructor(panelName) {
    this.assetForm = new AssetForm(panelName)
  }

  createVirtualAsset(isVAInSpace = false, isCardReaderShown = false) {
    this.assetForm.createVirtualAsset(isVAInSpace, isCardReaderShown)
  }

  updateVirtualAsset() {
    this.assetForm.updateVirtualAsset()
  }
}
