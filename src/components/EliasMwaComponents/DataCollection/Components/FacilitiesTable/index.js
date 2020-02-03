import React from 'react'
import { Table, Button, Dropdown, Icon, Menu } from 'antd'
import { isClickablePrototype } from '@/services/utils'
import InfiniteScrollWithMore from '../InfiniteScrollWithMore'

const ButtonGroup = Button.Group

const onSelectMenu = ({ key, domEvent }, record, actions) => {
  const { onEditFacility, onCompleteFacility } = actions
  domEvent.stopPropagation()

  switch (key) {
    case 'edit_facility':
      onEditFacility(record)
      break
    case 'complete_facility':
      onCompleteFacility(record)
      break
    default:
      break
  }
}

const menu = (projectName, facilityName, isCompleted, record, actions) => (
  <Menu
    onClick={e => onSelectMenu(e, record, actions)}
    data-test-selector="facility-action-dropdown"
  >
    <Menu.Item key="edit_facility" data-test-selector="edit_facility_action">
      Edit
    </Menu.Item>
    {!isCompleted && (
      <Menu.Item key="complete_facility" data-test-selector="complete_facility_link">
        Complete Facility
      </Menu.Item>
    )}
  </Menu>
)

export function FacilitySecondaryActions({ project, name, isCompleted }, record, index, actions) {
  const { OnGoToFacility } = actions

  return (
    <ButtonGroup>
      <Button
        data-test-selector="facilitiestable_action_button"
        onClick={() => {
          if (isClickablePrototype() && index !== 0) {
            alert('Please use first item in grid') //eslint-disable-line
            return
          }

          OnGoToFacility(record)
        }}
      >
        Floors
      </Button>
      <Dropdown
        overlay={menu(project, name, isCompleted, record, actions)}
        trigger={['click']}
        onClick={event => event.stopPropagation()}
      >
        <Button data-test-selector="facilitiestable_action_dropdown">
          <Icon type="ellipsis" />
        </Button>
      </Dropdown>
    </ButtonGroup>
  )
}

class FacilitiesTable extends InfiniteScrollWithMore {
  static defaultProps = {
    data: [],
    project: {},
  }

  render() {
    const { columns, onChangeSortBy, onPressItem, hideActions } = this.props
    const { visibleData } = this.state

    const newColumns = [...columns]
    if (!hideActions) {
      newColumns.push({
        title: '',
        key: 'action',
        className: 'actions',
        render: (action, record, index) => {
          const { onEditFacility, onCompleteFacility, OnGoToFacility } = this.props
          return FacilitySecondaryActions(action, record, index, {
            onEditFacility,
            onCompleteFacility,
            OnGoToFacility,
          })
        },
      })
    }

    return (
      <>
        <Table
          rowKey="id"
          className="utils__scrollTable"
          scroll={{ x: '100%' }}
          columns={newColumns}
          dataSource={visibleData}
          pagination={false}
          data-test-selector="facilitiestable"
          onRow={record => ({
            onClick: () => onPressItem && onPressItem(record),
            'data-test-selector': 'facilitiestable_row',
          })}
          onChange={(pagination, filter, sorter) => {
            onChangeSortBy(sorter.field, sorter.order === 'ascend')
          }}
        />
        {super.render()}
      </>
    )
  }
}

export default FacilitiesTable
