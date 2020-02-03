import React from 'react'
import _ from 'lodash'
import { TreeSelect } from 'antd'
import fuzzysort from 'fuzzysort'
import { makeSentenceCase } from '@/services/utils'

import styles from './style.scss'

export const makeFilterKeys = (treeData, searchText) => {
  if (searchText.length < 3) return []
  if (Array.isArray(treeData)) {
    return _.reduce(treeData, (res, obj) => [...res, ...makeFilterKeys(obj, searchText)], [])
  }

  if (treeData.children && treeData.children.length > 0) {
    const filteredKeys = makeFilterKeys(treeData.children, searchText)
    if (filteredKeys.length > 0) {
      return [...filteredKeys, treeData.key]
    }
  } else if (
    Object.prototype.hasOwnProperty.call(treeData, 'title') &&
    treeData.title.toLowerCase().includes(searchText.toLowerCase())
  ) {
    return [treeData.key]
  }

  return []
}
class SearchableTree extends React.Component {
  state = {
    searchText: '',
    expandedKeys: [],
    dropdownVisible: false,
  }

  onSearch = searchText => {
    const { treeData, autoComplete } = this.props
    const { expandedKeys } = this.state

    let newExpandedKeys = []
    if (!autoComplete) {
      newExpandedKeys = makeFilterKeys(treeData, searchText)
    }

    this.setState({
      searchText,
      expandedKeys: newExpandedKeys.length > 0 ? newExpandedKeys : expandedKeys,
    })
  }

  onTreeExpand = expandedKeys => {
    this.setState({ expandedKeys })
  }

  onDropdownVisibleChange = visible => {
    const { autoComplete, onSelect, value, onDropdownVisibleChange, pickingDateRange } = this.props
    const { searchText } = this.state

    if (autoComplete && !visible && onSelect) {
      onSelect(searchText)
    }
    if (autoComplete && visible) {
      this.setState({ searchText: value || '' })
    }

    if (onDropdownVisibleChange) {
      onDropdownVisibleChange(visible)
    }
    if (!pickingDateRange) {
      this.setState({ dropdownVisible: visible })
    }
  }

  onSelectParentNode = key => {
    const { expandedKeys } = this.state

    const index = expandedKeys.indexOf(key)
    if (index >= 0) {
      // it is expanded
      expandedKeys.splice(index, 1)
    } else {
      // it is collapsed
      expandedKeys.push(key)
    }

    this.setState({ expandedKeys: [...expandedKeys] })
  }

  makeClickable = treeData => {
    if (Array.isArray(treeData)) {
      return treeData.map(obj => this.makeClickable(obj))
    }

    const newTreeData = { ...treeData, title: makeSentenceCase(treeData.title) }

    // Avoid error exception
    if (!treeData) {
      return []
    }
    if (treeData.children && treeData.children.length > 0) {
      const children = this.makeClickable(treeData.children)
      newTreeData.children = children
      newTreeData.title = (
        <div onClick={() => this.onSelectParentNode(treeData.key)} role="presentation">
          {makeSentenceCase(treeData.title)}
        </div>
      )
    }

    return newTreeData
  }

  makeFilter = (treeData, searchText) => {
    if (searchText.length < 3) return treeData
    if (Array.isArray(treeData)) {
      return treeData.map(obj => this.makeFilter(obj, searchText)).filter(obj => obj)
    }
    if (treeData.title.toLowerCase().includes(searchText.toLowerCase())) {
      return treeData
    }
    if (treeData.children && treeData.children.length > 0) {
      const children = this.makeFilter(treeData.children, searchText)
      const newTreeData = { ...treeData }
      if (children.length === 0) return null
      newTreeData.children = children
      return newTreeData
    }
    return null
  }

  makeHighlight = (treeData, searchText) => {
    if (searchText.length < 3) return treeData
    if (treeData === null) return null
    if (Array.isArray(treeData)) {
      return treeData.map(obj => this.makeHighlight(obj, searchText))
    }

    const newTreeData = { ...treeData }
    if (treeData.children && treeData.children.length > 0) {
      const children = this.makeHighlight(treeData.children, searchText)
      newTreeData.children = children
    }
    const { title } = treeData
    const sentenceCasedTitle = makeSentenceCase(title)
    const indexes = []
    let id = sentenceCasedTitle.toLowerCase().indexOf(searchText.toLowerCase(), 0)
    while (id !== -1) {
      indexes.push(id)
      id += searchText.length
      id = sentenceCasedTitle.toLowerCase().indexOf(searchText.toLowerCase(), id)
    }

    const newTitle = (
      <div>
        {sentenceCasedTitle.slice(0, indexes.length > 0 ? indexes[0] : sentenceCasedTitle.length)}
        {indexes.map((index, order) => (
          <span key={`${searchText} - ${index}`}>
            <b>{sentenceCasedTitle.slice(index, searchText.length + index)}</b>
            {sentenceCasedTitle.slice(
              searchText.length + index,
              order === indexes.length - 1 ? sentenceCasedTitle.length : indexes[order + 1],
            )}
          </span>
        ))}
      </div>
    )
    newTreeData.title = newTitle

    return newTreeData
  }

  makeAutoComplete = (treeData, searchText, alias) => {
    const newTreeData = fuzzysort.go(searchText, treeData, { limit: 5 }).map(obj => {
      const hightlightObj = fuzzysort.highlight(obj, '<b>', '</b>')
      return {
        title: <span dangerouslySetInnerHTML={{ __html: hightlightObj }} />,
        key: obj.target,
        value: obj.target,
        selectable: true,
      }
    })

    const lowerSearchText = searchText.toLowerCase()
    if (alias && alias[lowerSearchText]) {
      newTreeData.unshift({
        title: alias[lowerSearchText],
        key: alias[lowerSearchText],
        value: alias[lowerSearchText],
        selectable: true,
      })
    }

    return newTreeData
  }

  render() {
    const {
      treeData,
      onSelect,
      placeholder,
      searchPlaceholder,
      autoComplete,
      limit,
      alias,
      customStyle,
      pickingDateRange,
      ...restProps
    } = this.props

    const { searchText, expandedKeys, dropdownVisible } = this.state

    let highlightTreeData = []

    if (!autoComplete) {
      const filteredTreeData = this.makeFilter(treeData, searchText)
      highlightTreeData = this.makeHighlight(filteredTreeData, searchText)
    } else {
      highlightTreeData = this.makeAutoComplete(
        treeData.map(item => makeSentenceCase(item)),
        searchText,
        alias,
      )
    }

    let limitedTreeData = limit ? highlightTreeData.slice(0, limit) : highlightTreeData
    limitedTreeData = this.makeClickable(limitedTreeData)

    return (
      <TreeSelect
        {...restProps}
        style={{ width: '100%', overflow: 'hidden', ...customStyle, color: '#444e57' }}
        filterTreeNode={() => true}
        treeData={limitedTreeData}
        placeholder={placeholder}
        searchPlaceholder={searchPlaceholder}
        searchValue={searchText}
        showSearch
        open={pickingDateRange || dropdownVisible}
        treeExpandedKeys={expandedKeys}
        dropdownClassName={styles.customDropDown}
        dropdownPopupAlign={{ overflow: { adjustY: 0, adjustX: 0 } }}
        onSearch={this.onSearch}
        onSelect={onSelect}
        onTreeExpand={this.onTreeExpand}
        onDropdownVisibleChange={this.onDropdownVisibleChange}
      />
    )
  }
}

export default SearchableTree
