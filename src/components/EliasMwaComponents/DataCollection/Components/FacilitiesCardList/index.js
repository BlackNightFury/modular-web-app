import React from 'react'
import { Row, Col } from 'antd'
import FacilitiesCard from './FacilitiesCard'
import InfiniteScrollWithMore from '../InfiniteScrollWithMore'

import styles from './style.scss'

class FacilitiesCardList extends InfiniteScrollWithMore {
  render() {
    const { onEditFacility, onCompleteFacility, OnGoToFacility } = this.props
    const { visibleData } = this.state

    return (
      <>
        <Row gutter={16} type="flex">
          {visibleData.map((itemData, idx) => (
            <Col
              data-test-selector="facilitiescardlist_column"
              xs={24}
              sm={24}
              md={12}
              lg={8}
              xl={8}
              key={itemData.id}
            >
              <div className={styles.card} data-test-selector="facilitiescardlist_card">
                <FacilitiesCard
                  key={itemData.id}
                  data={itemData}
                  isOdd={idx % 2}
                  index={idx}
                  onEditFacility={onEditFacility}
                  onCompleteFacility={onCompleteFacility}
                  OnGoToFacility={OnGoToFacility}
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

export default FacilitiesCardList
