import React from 'react'
import { Row, Col } from 'antd'
import { connect } from 'dva'
import FloorsCard from './FloorsCard'
import InfiniteScrollWithMore from '../InfiniteScrollWithMore'

import styles from './style.scss'

class FloorsCardList extends InfiniteScrollWithMore {
  render() {
    const { onPressItem, onSecondaryAction, isVAInSpace, projectName, facilityName } = this.props
    const { visibleData } = this.state

    return (
      <>
        <Row gutter={16}>
          {visibleData.map((itemData, idx) => (
            <Col
              data-test-selector="floorscardlist_column"
              xs={24}
              sm={24}
              md={12}
              lg={8}
              xl={8}
              key={itemData.id}
            >
              <div className={styles.card} data-test-selector="floorscardlist_card">
                <FloorsCard
                  key={itemData.id}
                  data={itemData}
                  isOdd={idx % 2}
                  onPressItem={onPressItem}
                  onSecondaryAction={onSecondaryAction}
                  isVAInSpace={isVAInSpace}
                  projectName={projectName}
                  facilityName={facilityName}
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
export default connect(mapStateToProps)(FloorsCardList)
