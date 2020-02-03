import React from 'react'
import { Icon, Button, Dropdown, Menu } from 'antd'

import styles from './style.scss'

class SortByButton extends React.Component {
  onChangeSortBy = ({ key }) => {
    const { isAscending, onChangeSortBy } = this.props
    onChangeSortBy(key, isAscending)
  }

  onChangeSortOrder = () => {
    const { isAscending, sortBy, onChangeSortBy } = this.props
    onChangeSortBy(sortBy, !isAscending)
  }

  render() {
    const { isAscending, sortBy, options } = this.props

    const menu = (
      <Menu onClick={this.onChangeSortBy}>
        {options.map(option => (
          <Menu.Item key={option.dataIndex}>{option.title}</Menu.Item>
        ))}
      </Menu>
    )

    const sortTitle = options.filter(option => option.dataIndex === sortBy)

    return (
      <div className={styles.container}>
        <Dropdown overlay={menu} className={styles.groupContainer}>
          <Button>
            <span className={styles.text}>
              Sort by <b>{sortTitle && sortTitle[0].title && sortTitle[0].title.toLowerCase()}</b>
            </span>
            <div className={styles.arrowDownContainer}>
              <Icon width={18} height={18} className={styles.arrowDown} type="caret-down" />
            </div>
          </Button>
        </Dropdown>
        <Button className={styles.sortOrderButton} onClick={this.onChangeSortOrder}>
          <Icon
            width={18}
            height={18}
            className={styles.arrowDown}
            type={isAscending ? 'sort-ascending' : 'sort-descending'}
          />
        </Button>
      </div>
    )
  }
}

export default SortByButton
