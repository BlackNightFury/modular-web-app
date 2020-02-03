import React from 'react'
import { connect } from 'dva'
import _ from 'lodash'
import KnownIssuesTable from '@/components/EliasMwaComponents/DataCollection/Components/KnownIssuesTable'
import KnwonIssuesGQLWrapper from '@/components/EliasMwaComponents/GraphqlAPI/KnownIssuesGQLWrapper'
import { sort, findDetailsFromHierarchyTree, getProjectByName } from '@/services/utils'
import { getViewMode, hasRole } from '@/services/user'

import styles from './style.scss'
import CommonPage, { renderCollapseComponent } from '../../Pages/CommonPage'
import EditAssetDrawer from '../EditAssetDrawer'
import EditVirtualAssetDrawer from '../EditVirtualAssetDrawer'
import { getIssues, getIssuesTime, QA_RULE } from '@/services/qa'
import KnownIssuesCardList from '../KnownIssuesCardList'
import { runQA } from '@/services/task'
import { getBrowserLocaledDateTimeString } from '@/services/datetime'

export const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    sorter: (a, b) => a.name.localeCompare(b.name),
  },
  {
    title: 'Type',
    dataIndex: 'type',
    key: 'type',
    className: styles.hiddenXs,
    sorter: (a, b) => a.type.localeCompare(b.type),
  },
  {
    title: 'Issue',
    dataIndex: 'issue',
    key: 'issue',
    sorter: (a, b) => a.issue.localeCompare(b.issue),
  },
  {
    title: 'Project',
    dataIndex: 'project',
    key: 'project',
    className: styles.hiddenSm,
    render: text => text && text.toLocaleString(),
    sorter: (a, b) => a.project - b.project,
  },
  {
    title: 'Location',
    dataIndex: 'location',
    key: 'location',
    className: styles.hiddenXl,
    sorter: (a, b) => a.location.localeCompare(b.location),
  },
  {
    title: 'Last edited',
    dataIndex: 'createdAt',
    key: 'createdAt',
    className: styles.hiddenXl,
    render: text => getBrowserLocaledDateTimeString(text, true),
    sorter: (a, b) => a.createdAt && a.createdAt.localeCompare(b.createdAt),
  },
]

const mapStateToProps = ({ user, completion }) => ({
  user,
  completion,
})

@connect(mapStateToProps)
class KnownIssues extends CommonPage {
  state = {
    viewMode: getViewMode(),
    sortOption: {
      isAscending: false,
      field: 'createdAt',
    },
    knownIssues: [],
    issueUpdatedTime: null,
    selectedItem: null,
    isEditing: false,
  }

  componentDidMount() {
    this.updateIssuesView()
  }

  updateIssuesView = () => {
    const issues = getIssues()
    const issuesTime = getIssuesTime()

    const knownIssues = _.reduce(
      issues,
      (prev, cur) => {
        const { type: issue, details } = cur

        switch (issue) {
          case QA_RULE.DUPLICATE_BARCDE:
            return _.reduce(
              details,
              (subprev, detail) => {
                const { text, id } = detail
                if (!text) return subprev
                const infos = text.split(', ')

                subprev.push({
                  id,
                  key: id,
                  name: infos.pop(),
                  type: 'Asset',
                  issue,
                  project: infos[0],
                  location: infos.join(',  '),
                })

                return subprev
              },
              prev,
            )
          default:
            return prev
        }
      },
      [],
    )

    this.setState({ knownIssues, issueUpdatedTime: issuesTime })
  }

  onRefresh = () => {
    const { allRecords } = this.props
    runQA(allRecords)

    this.updateIssuesView()
  }

  onPressItem = issue => {
    if (!issue.detail) return
    switch (issue.type) {
      case 'Asset': {
        const { treeData } = this.props
        const facet = findDetailsFromHierarchyTree(issue.detail && issue.detail.type, treeData)
        if (facet['install-date']) {
          facet['install-date'] = getBrowserLocaledDateTimeString(facet['install-date'])
        }
        const selectedItem = {
          type: issue.type,
          facet,
          item: issue.detail,
        }

        this.setState({ selectedItem, isEditing: true })
        break
      }
      default:
        break
    }
  }

  onUpdateAsset = row => {
    const { 'install-date': installDate, quantity, condition, ...restItem } = row
    const { onUpdateAsset, assets, isVAInSpace } = this.props
    const {
      selectedItem: { item: selectedItem },
    } = this.state
    if (isVAInSpace) {
      delete restItem.virtual
      delete selectedItem.virtual

      onUpdateAsset({ ...selectedItem, ...restItem }, assets)
    } else {
      onUpdateAsset({ ...selectedItem, ...row }, assets)
    }

    this.setState({ isEditing: false })
  }

  render() {
    const {
      knownIssues,
      viewMode,
      sortOption,
      selectedItem,
      isEditing,
      issueUpdatedTime,
    } = this.state
    const { assets, user, projects, facilityId } = this.props
    const { roles } = user
    const detailedKnownIssues = knownIssues
      .map(obj => {
        const { id, issue } = obj
        switch (issue) {
          case QA_RULE.DUPLICATE_BARCDE: {
            const asset = assets.find(item => item.id === id)
            if (asset) return { ...obj, createdAt: asset.createdAt, detail: asset }
            return obj
          }
          default:
            return issue
        }
      })
      .filter(obj => !facilityId || (obj.detail && obj.detail.facilityId === facilityId))

    const sortedData = sort(detailedKnownIssues, sortOption.field, sortOption.isAscending)

    const newColumns = columns.map(column => {
      if (column.dataIndex === sortOption.field) {
        return { ...column, sortOrder: sortOption.isAscending ? 'ascend' : 'descend' }
      }
      return column
    })

    const tableContent = (
      <div className={styles.facilitiesContainer}>
        {viewMode ? (
          <KnownIssuesTable
            data={sortedData}
            columns={newColumns}
            onChangeSortBy={this.onChangeSortBy}
            onPressItem={this.onPressItem}
          />
        ) : (
          <KnownIssuesCardList data={sortedData} onEdit={this.onPressItem} />
        )}
      </div>
    )

    return (
      <>
        {this.renderCardHeader({
          columns,
          styles,
          addBtnTitle: 'Refresh',
          dataTestSelector: 'refresh',
          showFilterByBtn: false,
          assetTypes: [],
          onAdd: this.onRefresh,
        })}
        {renderCollapseComponent({
          styles,
          key: 'knownIssues',
          headerCurrent: 'Known Issues',
          headerParent: undefined,
          numberOfResults: detailedKnownIssues.length,
          updatedTime:
            issueUpdatedTime && getBrowserLocaledDateTimeString(issueUpdatedTime, true, true),
          tableContent,
        })}
        {selectedItem &&
          selectedItem.type === 'Asset' &&
          (selectedItem.facet.virtual ? (
            <EditVirtualAssetDrawer
              visible={isEditing}
              assetDetail={selectedItem.facet}
              item={selectedItem}
              onClose={this.onCloseEditing}
              onConfirm={this.onUpdateAsset}
              tenant={user.tenant ? user.tenant : {}}
              isEditDisabled={!hasRole(roles, 'admin')}
              disabled={getProjectByName(projects, selectedItem.project).readonly}
            />
          ) : (
            <EditAssetDrawer
              visible={isEditing}
              assetDetail={selectedItem.facet}
              item={selectedItem.item}
              onClose={this.onCloseEditing}
              onConfirm={this.onUpdateAsset}
              tenant={user.tenant ? user.tenant : {}}
              disabled={getProjectByName(projects, selectedItem.project).readonly}
            />
          ))}
      </>
    )
  }
}

export const KnownIssuesComponent = KnownIssues
export default KnwonIssuesGQLWrapper(KnownIssues)
