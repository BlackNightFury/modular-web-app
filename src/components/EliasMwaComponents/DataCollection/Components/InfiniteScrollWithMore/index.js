import React from 'react'
import { Button } from 'antd'

import styles from './style.scss'

const initialPageSize = 10
const pageSize = 10

class InfiniteScrollWithMore extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      visibleData: [],
    }
  }

  componentWillMount() {
    this.initializeVisibleData(this.props)
  }

  componentWillReceiveProps(nextProps) {
    this.initializeVisibleData(nextProps)
  }

  initializeVisibleData(props) {
    const { data } = props
    this.setState({
      visibleData: data.slice(0, initialPageSize),
    })
  }

  loadMore() {
    const { data } = this.props
    const { visibleData } = this.state
    this.setState({
      visibleData: data.slice(0, visibleData.length + pageSize),
    })
  }

  render() {
    const { data } = this.props
    const { visibleData } = this.state
    return (
      <Button
        className={styles.btnLoadMore}
        onClick={() => this.loadMore()}
        disabled={data.length === visibleData.length}
        data-test-selector="load-more"
      >
        More
      </Button>
    )
  }
}

export default InfiniteScrollWithMore
