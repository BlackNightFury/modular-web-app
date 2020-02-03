import React from 'react'
import { connect } from 'dva'
import { Table } from 'antd'
import InfiniteScrollWithMore from '../InfiniteScrollWithMore'
import styles from './style.scss'

const mapStateToProps = ({ user }) => ({ authUser: user })
@connect(mapStateToProps)
class KnownIssuesTable extends InfiniteScrollWithMore {
  static defaultProps = {
    data: [],
    projectName: '',
    facilityName: '',
    onPressItem: () => {},
  }

  onTableDropDown = event => {
    event.stopPropagation()
  }

  onMenuClick = (item, { key, domEvent }) => {
    domEvent.stopPropagation()
    const { onSecondaryAction } = this.props
    onSecondaryAction(key, item)
  }

  render() {
    const { onPressItem, onChangeSortBy, highlighted, columns } = this.props
    const { visibleData } = this.state

    return (
      <>
        <Table
          rowKey="id"
          className="utils__scrollTable"
          scroll={{ x: '100%' }}
          columns={columns}
          dataSource={visibleData}
          pagination={false}
          onRow={record => ({
            onClick: () => onPressItem(record),
            'data-test-selector': 'knownissuestable_row',
          })}
          rowClassName={record => {
            if (record.id === highlighted) {
              return styles.highlighted
            }
            return ''
          }}
          onChange={(pagination, filter, sorter) => {
            onChangeSortBy(sorter.field, sorter.order === 'ascend')
          }}
        />
        {super.render()}
      </>
    )
  }
}

export default KnownIssuesTable
