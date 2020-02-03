import { expect } from 'chai'
import router from 'umi/router'

export default class SpacesCardList {
  constructor(object) {
    this.object = object
  }

  get component() {
    return this.object.component
  }

  checkCardView() {
    expect(this.component.exists('[data-test-selector="spacescardlist_card"]')).to.equal(true)
  }

  clickAssetLink() {
    this.component
      .find('[data-test-selector="spacestable_action_link"]')
      .first()
      .simulate('click')
  }

  checkSpacePageRedirection = () => {
    expect(router.url).to.equal(
      '/data-collection/test-project/facilities/test-facility/floors/test-floor/spaces/1-test-space',
    )
  }

  clickFavorite() {
    this.component
      .find('[data-test-selector="spacestable_action_dropdown"]')
      .first()
      .simulate('click')
    this.component
      .find('[data-test-selector="favorite_space_action"]')
      .first()
      .simulate('click')
  }

  checkFavorite = () => {
    const actions = global.store.getActions()
    expect(actions.length).to.equal(1)
    expect(actions[0].payload.favSpaces.length).to.equal(1)
  }
}
