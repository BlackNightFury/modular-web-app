import React from 'react'
import { connect } from 'dva'
import { Table, Icon, Button, Dropdown, Menu } from 'antd'
import Link from 'umi/link'
import { makeSurveyUrl, isClickablePrototype, getConcatenatedUrl } from '@/services/utils'
import { hasRole } from '@/services/user'
import InfiniteScrollWithMore from '../InfiniteScrollWithMore'
import styles from './style.scss'

const ButtonGroup = Button.Group

const onMenuClick = (item, { key, domEvent }, props) => {
  domEvent.stopPropagation()
  const { onSecondaryAction } = props
  onSecondaryAction(key, item)
}

const menu = (floor, record, props) => {
  const { projectName, facilityName, isVAInSpace, authUser } = props
  const { roles } = authUser

  return (
    <Menu onClick={e => onMenuClick(record, e, props)}>
      {!isVAInSpace && (
        <Menu.Item key="virtual_assets">
          <Link to={`${makeSurveyUrl(projectName, facilityName, floor)}/virtual-assets`}>
            Virtual assets
          </Link>
        </Menu.Item>
      )}
      {record.status !== 'DONE' && (
        <Menu.Item key="complete" data-test-selector="complete_floor_button">
          Complete
        </Menu.Item>
      )}
      <Menu.Item key="delete" data-test-selector="delete_floor_button">
        Delete
      </Menu.Item>
      {hasRole(roles, 'admin') && <Menu.Item key="move">Move</Menu.Item>}
      {hasRole(roles, 'admin') && <Menu.Item key="move_all_spaces">Move All Spaces</Menu.Item>}
    </Menu>
  )
}

export const FloorSecondaryActions = ({ id, name }, record, index, props) => {
  const { projectName, facilityName } = props
  return (
    <ButtonGroup>
      <Button
        data-test-selector="floorstable_action_button"
        onClick={() => {
          if (isClickablePrototype() && index !== 0) {
            alert('Please use first item in grid') //eslint-disable-line
          }
        }}
      >
        <Link
          data-test-selector="floorstable_action_link"
          to={
            isClickablePrototype() && index !== 0
              ? {}
              : makeSurveyUrl(projectName, facilityName, getConcatenatedUrl(id, name))
          }
        >
          Spaces
        </Link>
      </Button>
      <Dropdown
        overlay={menu(getConcatenatedUrl(id, name), record, props)}
        trigger={['click']}
        onClick={event => event.stopPropagation()}
      >
        <Button data-test-selector="floorstable_action_dropdown">
          <Icon type="ellipsis" />
        </Button>
      </Dropdown>
    </ButtonGroup>
  )
}

const mapStateToProps = ({ user }) => ({ authUser: user })
@connect(mapStateToProps)
class FloorsTable extends InfiniteScrollWithMore {
  static defaultProps = {
    data: [],
    projectName: '',
    facilityName: '',
    onPressItem: () => {},
  }

  render() {
    const { onPressItem, onChangeSortBy, highlighted, columns } = this.props
    const { visibleData } = this.state

    const newColumns = [...columns]
    newColumns.push({
      title: '',
      key: 'action',
      className: 'actions',
      render: (action, record, index) => FloorSecondaryActions(action, record, index, this.props),
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
          onRow={record => ({
            onClick: () => onPressItem(record),
            'data-test-selector': 'floorstable_row',
            'data-test-record-id': record.id,
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

export default FloorsTable
