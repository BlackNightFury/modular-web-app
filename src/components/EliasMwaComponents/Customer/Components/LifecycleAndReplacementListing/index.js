import React from 'react'
import AssetListing from '@/components/EliasMwaComponents/DataCollection/Components/AssetListing'

class LifecycleAndReplacementListing extends React.Component {
  render() {
    const {
      viewMode,
      columns,
      sortOption,
      onChangeSortBy,
      filteredAssets,
      treeData,
      isVirtual,
      onEdit,
      onView,
    } = this.props

    const newColumns = columns.map(column => {
      if (column.dataIndex === sortOption.field) {
        return { ...column, sortOrder: sortOption.isAscending ? 'ascend' : 'descend' }
      }
      return column
    })

    return (
      <AssetListing
        viewMode={viewMode}
        columns={newColumns}
        sortOption={sortOption}
        onChangeSortBy={onChangeSortBy}
        headerCurrent="Assets - my estate"
        headerParent=""
        filteredAssets={filteredAssets}
        treeData={treeData}
        isVirtual={isVirtual}
        onEdit={onEdit}
        onView={onView}
        onPressItem={() => {}}
        isVAInSpace
        isCustomer
      />
    )
  }
}

export default LifecycleAndReplacementListing
