import React from 'react'
import { Row, Col } from 'antd'
import { connect } from 'dva'
import { makeSurveyUrl, getConcatenatedUrl } from '@/services/utils'
import SpacesCard from './SpacesCard'
import InfiniteScrollWithMore from '../InfiniteScrollWithMore'

import styles from './style.scss'

class SpacesCardList extends InfiniteScrollWithMore {
  onFavorite = itemData => event => {
    event.stopPropagation()
    const { user, dispatch, projectName, facilityName, floorName } = this.props
    let { favSpaces } = user
    const isInFavSpaces = favSpaces.find(space => space.asset.id === itemData.id)
    if (isInFavSpaces) {
      favSpaces = favSpaces.filter(space => space.asset.id !== itemData.id)
    } else {
      favSpaces = [
        ...favSpaces,
        {
          asset: itemData,
          url: makeSurveyUrl(
            projectName,
            facilityName,
            floorName,
            getConcatenatedUrl(itemData.id, itemData.name),
          ),
        },
      ]
    }

    dispatch({
      type: 'user/SET_STATE',
      payload: { favSpaces },
    })
  }

  render() {
    const { user, projectName, facilityName, floorName } = this.props
    const { visibleData } = this.state
    const { favSpaces } = user

    return (
      <>
        <Row gutter={16} type="flex">
          {visibleData.map((itemData, idx) => (
            <Col
              data-test-selector="spacescardlist_column"
              xs={24}
              sm={24}
              md={12}
              lg={8}
              xl={8}
              key={itemData.id}
            >
              <div className={styles.card} data-test-selector="spacescardlist_card">
                <SpacesCard
                  key={itemData.id}
                  data={itemData}
                  onFavorite={this.onFavorite(itemData)}
                  isFavorite={!!favSpaces.find(space => space.asset.id === itemData.id)}
                  isOdd={idx % 2}
                  projectName={projectName}
                  facilityName={facilityName}
                  floorName={floorName}
                />
              </div>
            </Col>
          ))}
        </Row>
        {super.render()}
      </>
    )
  }
}

const mapStateToProps = ({ user }) => ({ user })
export default connect(mapStateToProps)(SpacesCardList)
