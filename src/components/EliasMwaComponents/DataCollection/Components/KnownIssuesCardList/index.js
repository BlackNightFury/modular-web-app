import React from 'react'
import { Row, Col } from 'antd'
import ActionCard from '../ActionCard'
import KnownIssuesCardDetail from './KnownIssuesCardDetail'
import InfiniteScrollWithMore from '../InfiniteScrollWithMore'

class KnownIssuesCardList extends InfiniteScrollWithMore {
  static defaultProps = {
    data: [],
  }

  render() {
    const { data, onEdit } = this.props

    return (
      <>
        <Row gutter={16} type="flex">
          {data.map((itemData, idx) => (
            <Col
              data-test-selector="assetcardlist_column"
              xs={24}
              sm={24}
              md={12}
              lg={8}
              xl={8}
              key={itemData.id}
            >
              <ActionCard data-test-selector="assetcardlist_card" menus={[]}>
                <KnownIssuesCardDetail
                  itemData={itemData}
                  onEdit={() => onEdit(itemData)}
                  isOdd={idx % 2}
                />
              </ActionCard>
            </Col>
          ))}
        </Row>
        {super.render()}
      </>
    )
  }
}

export default KnownIssuesCardList
