import React from 'react'
import AssetsCardList from '@/components/EliasMwaComponents/DataCollection/Components/AssetsCardList'
import AssetsTable from '@/components/EliasMwaComponents/DataCollection/Components/AssetsTable'
import { renderCollapseComponent } from '@/components/EliasMwaComponents/DataCollection/Pages/CommonPage'
import { sort, getSorter } from '@/services/utils'
import styles from './style.scss'

class AssetListing extends React.Component {
  render() {
    const {
      viewMode,
      columns,
      sortOption,
      onChangeSortBy,
      headerCurrent,
      headerParent,
      filteredAssets,
      isVirtual,
      onEdit,
      onView,
      onPressItem,
      onUpdate,
      onCopy,
      onDelete,
      onMenu,
      highlighted,
      tenant,
      readOnly,
      isVAInSpace,
      isCustomer,
      isCopyAssets,
      treeData,
    } = this.props

    const sortedData = sort(filteredAssets, getSorter(sortOption), sortOption.isAscending, true)

    const tableContent = (
      <div className={styles.assetsConainer}>
        {viewMode ? (
          <AssetsTable
            columns={columns}
            data={sortedData}
            onView={onView}
            onEdit={onEdit}
            onChangeSortBy={onChangeSortBy}
            onPressItem={onPressItem}
            onUpdate={onUpdate}
            onCopy={onCopy}
            onDelete={onDelete}
            isVirtualAssets={isVirtual}
            highlighted={highlighted}
            isVAInSpace={isVAInSpace}
            isCustomer={isCustomer}
            isCopyAssets={isCopyAssets}
          />
        ) : (
          <AssetsCardList
            data={sortedData}
            onEdit={onEdit}
            onView={onView}
            onDelete={onDelete}
            onMenu={onMenu}
            onUpdate={onUpdate}
            tenant={tenant}
            isCustomer={isCustomer}
            isVAInSpace={isVAInSpace}
            isVirtualAssets={isVirtual}
            readOnly={readOnly}
            isCopyAssets={isCopyAssets}
            treeData={treeData}
          />
        )}
      </div>
    )

    return (
      <>
        {renderCollapseComponent({
          styles,
          key: 'assets',
          headerCurrent,
          headerParent,
          numberOfResults: sortedData.length,
          tableContent,
        })}
      </>
    )
  }
}

export default AssetListing
