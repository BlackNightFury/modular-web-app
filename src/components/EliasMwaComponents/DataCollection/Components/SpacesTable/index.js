import React from 'react'
import { Table, Button, Dropdown, Menu, Icon } from 'antd'
import { connect } from 'dva'
import Link from 'umi/link'
import { makeSurveyUrl, isClickablePrototype, getConcatenatedUrl } from '@/services/utils'
import { hasRole } from '@/services/user'
import InfiniteScrollWithMore from '../InfiniteScrollWithMore'
import styles from './style.scss'

const ButtonGroup = Button.Group

const onFavorite = (itemData, props) => {
  const { user, dispatch, projectName, facilityName, floorName } = props
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

const onSelectMenu = ({ key, domEvent }, itemData, props) => {
  const { onDelete } = props

  domEvent.stopPropagation()
  switch (key) {
    case 'favorite':
      onFavorite(itemData, props)
      break
    case 'delete':
      onDelete(itemData)
      break
    default:
      break
  }
}

const goMenu = (itemData, props) => {
  const { user } = props
  const { roles, favSpaces } = user
  return (
    <Menu onClick={e => onSelectMenu(e, itemData, props)}>
      {hasRole(roles, 'admin') && <Menu.Item key="move">Move</Menu.Item>}
      <Menu.Item key="favorite" data-test-selector="favorite_space_action">
        {favSpaces.find(space => space.asset.id === itemData.id) ? 'Unfavorite' : 'Favorite'}
      </Menu.Item>
      <Menu.Item key="delete" data-test-selector="delete_space_action">
        Delete
      </Menu.Item>
    </Menu>
  )
}

export const SpaceSecondaryActions = ({ id, name }, record, index, props) => {
  const { projectName, facilityName, floorName } = props
  return (
    <ButtonGroup>
      <Button
        data-test-selector="spacestable_action_button"
        onClick={() => {
          if (isClickablePrototype() && index !== 0) {
            alert('Please use first item in grid') //eslint-disable-line
          }
        }}
      >
        <Link
          data-test-selector="spacestable_action_link"
          to={
            isClickablePrototype() && index !== 0
              ? {}
              : makeSurveyUrl(projectName, facilityName, floorName, getConcatenatedUrl(id, name))
          }
        >
          Assets
        </Link>
      </Button>
      <Dropdown
        overlay={goMenu(record, props)}
        trigger={['click']}
        onClick={e => e.stopPropagation()}
      >
        <Button data-test-selector="spacestable_action_dropdown">
          <Icon type="ellipsis" />
        </Button>
      </Dropdown>
    </ButtonGroup>
  )
}
const mapStateToProps = ({ user }) => ({ user })
@connect(mapStateToProps)
class SpacesTable extends InfiniteScrollWithMore {
  static defaultProps = {
    data: [],
    projectName: '',
    facilityName: '',
    floorName: '',
  }

  render() {
    const { onPressItem, onChangeSortBy, highlighted, columns } = this.props
    const { visibleData } = this.state
    const newColumns = [...columns]
    newColumns.push({
      title: '',
      key: 'action',
      className: 'actions',
      render: (action, record, index) => SpaceSecondaryActions(action, record, index, this.props),
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
            'data-test-selector': 'spacestable_row',
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

export default SpacesTable
