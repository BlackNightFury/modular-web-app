import PreSurveyorQuestionnaire from './preSurveyorQuestionnaire'
import CopyAssetsForm from './copyAssetsForm'
import EditAssetForm from './editAssetForm'

export default class RightHandDrawer {
  constructor() {
    this.preSurveyorQuestionnaire = new PreSurveyorQuestionnaire()
    this.copyAssetsForm = new CopyAssetsForm()
    this.editAssetForm = new EditAssetForm()
  }
}
