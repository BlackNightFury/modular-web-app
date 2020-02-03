import 'ignore-styles'
import { expect } from 'chai'
import WithTopBar from '@/../testing/integration/step_definitions/common/objects/withTopBar'

export default class CustomerMyStateAsset extends WithTopBar {
  constructor() {
    super()
    this.component = null

    this.mockTopBarProps = {
      breadcrumbs: ['Analytics', 'Asset Replacement Cost'],
      isTest: true,
    }
  }

  checkBreadcrumb = () => {
    const breadcrumbs = this.topBar.find('[data-test-selector="breadcrumb-text"]')
    expect(breadcrumbs).to.have.lengthOf(2)

    expect(
      breadcrumbs
        .first()
        .find('a')
        .first()
        .text(),
    ).to.equal('Analytics')
    expect(
      breadcrumbs
        .last()
        .find('span')
        .first()
        .text(),
    ).to.equal('Asset Replacement Cost')
  }
}
