import React from 'react'
import { withRouter } from 'dva/router'
import MyEstateGQLWrapper from '@/components/EliasMwaComponents/GraphqlAPI/MyEstateGQLWrapper'
import { renderItemWithInfo } from '../Common'
import { isClickablePrototype } from '@/services/utils'

@withRouter
class MyEstateModule extends React.Component {
  goToDataPage = assetType => () => {
    const {
      history,
      user: { authenticatedBy },
      closeContextPanelOnSmallDevices,
    } = this.props
    history.push(
      `${authenticatedBy === 'demo' ? '/clickable-prototype' : ''}/my-estate/${assetType}`,
    )
    closeContextPanelOnSmallDevices()
  }

  render() {
    const { facilities, spaces, floors, assets } = this.props
    return (
      <>
        {renderItemWithInfo(
          'Facilities',
          'bank',
          `[${facilities.length}]`,
          this.goToDataPage('facilities'),
          'facility_link',
        )}
        {isClickablePrototype() &&
          renderItemWithInfo(
            'Floors',
            'scan',
            `[${floors.length}]`,
            this.goToDataPage('floors'),
            'floor_link',
          )}
        {isClickablePrototype() &&
          renderItemWithInfo(
            'Spaces',
            'border',
            `[${spaces.length}]`,
            this.goToDataPage('spaces'),
            'space_link',
          )}
        {renderItemWithInfo(
          'Assets',
          'barcode',
          `[${assets.length}]`,
          this.goToDataPage('assets'),
          'asset_link',
        )}
      </>
    )
  }
}

export default MyEstateGQLWrapper(MyEstateModule)
