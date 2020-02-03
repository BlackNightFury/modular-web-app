import React from 'react'
import { AutoComplete } from 'antd'
import fuzzysort from 'fuzzysort'
import dataSource from './manufacturers.json'

class ManufacturerInput extends React.Component {
  state = {
    searchValue: '',
  }

  onHandleSearch = value => this.setState({ searchValue: value })

  render() {
    const { searchValue } = this.state
    const fuzzySortArray = fuzzysort
      .go(searchValue, dataSource, { limit: 5 })
      .map(obj => obj.target)

    return (
      <AutoComplete dataSource={fuzzySortArray} onSearch={this.onHandleSearch} {...this.props} />
    )
  }
}

export default ManufacturerInput
