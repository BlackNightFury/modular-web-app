import React from 'react'
import { Icon, Tooltip } from 'antd'
import Link from 'umi/link'
import { makeCustomerUrl, getConcatenatedUrl } from '@/services/utils'
import AssetListing from '@/components/EliasMwaComponents/DataCollection/Components/AssetListing'
import styles from './style.scss'

class AssetManagementListing extends React.Component {
  onGoAsset = record => {
    const { history } = this.props

    history.push(
      makeCustomerUrl(
        record.projectId,
        record.facilityId,
        record.floorId,
        record.spaceId,
        record.id,
      ),
    )
  }

  render() {
    const {
      viewMode,
      columns,
      sortOption,
      onChangeSortBy,
      projects,
      facilities,
      floors,
      spaces,
      filteredAssets,
      treeData,
      isVirtual,
      onEdit,
      onView,
    } = this.props

    const newColumns = columns.map(column => {
      let newColumn = column
      if (column.dataIndex === 'type') {
        newColumn = {
          ...column,
          render: (assetType, row) => {
            const { facets: rowData } = row
            const assetTypeValue = `${
              row.assetType && row.assetType.description ? row.assetType.description : ''
            }, ${rowData.quantity}`
            let name = assetTypeValue

            if (rowData.barcode) {
              name += ` ${rowData.barcode}`
            }
            let toolTipText = ''
            if (rowData.manufacturer) {
              toolTipText += `${rowData.manufacturer}, `
            }
            if (rowData.model) {
              toolTipText += `${rowData.model}, `
            }
            toolTipText += assetTypeValue
            return (
              <Tooltip placement="topLeft" title={toolTipText}>
                <span className={styles.nameStyle}>
                  {assetType.virtual ? <Icon type="bulb" /> : <Icon type="wallet" />}
                  <Link
                    to={makeCustomerUrl(
                      row.projectId,
                      row.facilityId,
                      row.floorId,
                      row.spaceId,
                      row.id,
                    )}
                    className={styles.detailLinkMargin}
                  >
                    {name}
                  </Link>
                  <span className={styles.quantityStyle}>{rowData.quantity}</span>
                </span>
              </Tooltip>
            )
          },
        }
      }

      if (column.dataIndex === 'facility') {
        newColumn = {
          ...column,
          render: (text, row) => {
            const facility = facilities.find(item => item.id === row.facilityId)
            const project = projects.find(item => item.id === row.projectId)
            const floor = floors.find(item => item.id === row.floorId)
            const space = spaces.find(item => item.id === row.spaceId)
            if (facility && project && floor) {
              let toolTipText = `${facility.siteId}, ${facility.name}, ${floor.name}`
              if (space) {
                toolTipText += `, ${space.name}`
              }
              return (
                <Tooltip placement="topLeft" title={toolTipText}>
                  <span className={styles.nameStyle}>
                    <Link
                      to={makeCustomerUrl(
                        getConcatenatedUrl(project.code || 'null', project.name),
                        getConcatenatedUrl(facility.code || 'null', facility.name),
                      )}
                    >
                      {text}
                    </Link>
                  </span>
                </Tooltip>
              )
            }
            return <></>
          },
        }
      }
      if (column.dataIndex === sortOption.field) {
        return { ...newColumn, sortOrder: sortOption.isAscending ? 'ascend' : 'descend' }
      }
      return newColumn
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

export default AssetManagementListing
