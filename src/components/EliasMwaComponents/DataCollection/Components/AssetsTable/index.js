import React from 'react'
import { Table, Menu } from 'antd'
import { get } from 'lodash'
import InfiniteScrollWithMore from '../InfiniteScrollWithMore'
import AssetSecondaryActions from '../AssetSecondaryActions'

import styles from './style.scss'

/* eslint-disable */
class AssetsTable extends InfiniteScrollWithMore {
  static defaultProps = {
    data: [],
  }

  onAdd = (itemData, newQty) => {
    const { onUpdate } = this.props

    const newItemData = {
      ...itemData,
      facets: { ...itemData.facets, quantity: newQty },
    }

    onUpdate(newItemData)
  }

  onSelectMenu = ({ key, domEvent }, record) => {
    const { onCopy, onDelete, onEdit } = this.props

    domEvent.stopPropagation()
    switch (key) {
      case 'copy_asset':
        onCopy(record)
        break
      case 'delete_asset':
        onDelete(record)
        break
      case 'edit_asset':
        onEdit(record)
        break
      default:
        break
    }
  }

  onAssetDropDown = event => {
    event.stopPropagation()
  }

  render() {
    const {
      rowSelection,
      onPressItem,
      onChangeSortBy,
      isVirtualAssets,
      onUpdate,
      highlighted,
      columns,
      isVAInSpace,
      readOnly,
      isCustomer,
    } = this.props
    const { visibleData } = this.state
    const goMenu = record => (
      <Menu onClick={e => this.onSelectMenu(e, record)}>
        {!isCustomer && <Menu.Item key="active_asset">Active</Menu.Item>}
        {!isCustomer && !isVirtualAssets && <Menu.Item key="copy_asset">Copy</Menu.Item>}
        {!isCustomer && <Menu.Item key="delete_asset">Delete</Menu.Item>}
        {isCustomer && <Menu.Item key="edit_asset">Edit</Menu.Item>}
      </Menu>
    )
    const newColumns = [...columns]

    newColumns.push({
      title: '',
      key: 'action',
      className: 'actions',
      render: record => (
        <AssetSecondaryActions
          onClick={() => {
            onPressItem(record)
          }}
          dataTestSelectorAction="assetstable_action_button"
          dropdownOverlay={goMenu(record)}
          dataTestSelectorEllipsis="assetstable_action_dropdown"
          dropdownClick={this.onAssetDropDown}
          isCustomer={isCustomer}
        />
      ),
    })

    return (
      <>
        <Table
          rowKey="id"
          className="utils__scrollTable"
          scroll={{ x: '100%' }}
          columns={newColumns}
          dataSource={visibleData}
          pagination={false}
          data-test-selector="assetstable"
          rowSelection={rowSelection}
          onRow={record => ({
            onClick: () => onPressItem(record),
            'data-test-selector': 'assetstable_row',
            'data-test-record-id': record.id,
          })}
          rowClassName={record => {
            if (record.id === highlighted) {
              return styles.highlighted
            }
            return ''
          }}
          onChange={(pagination, filter, sorter) => {
            onChangeSortBy(
              sorter.field,
              sorter.order === 'ascend',
              get(sorter, 'column.sorter', ''),
            )
          }}
        />
        {super.render()}
      </>
    )
  }
}

export default AssetsTable
