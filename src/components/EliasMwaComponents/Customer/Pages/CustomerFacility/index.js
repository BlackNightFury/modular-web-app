import React from 'react'
import { Helmet } from 'react-helmet'
import Link from 'umi/link'
import { sort, filterData, makeCustomerUrl, getConcatenatedUrl } from '@/services/utils'
import { getViewMode } from '@/services/user'
import CommonPage, {
  renderCollapseComponent,
} from '@/components/EliasMwaComponents/DataCollection/Pages/CommonPage'
import { getBrowserLocaledDateTimeString } from '@/services/datetime'
import FacilitiesTable from '@/components/EliasMwaComponents/DataCollection/Components/FacilitiesTable'
import FacilitiesCardList from '@/components/EliasMwaComponents/DataCollection/Components/FacilitiesCardList'

import styles from './style.scss'

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    className: styles.firstColumn,
    render: (text, record) => (
      <Link
        to={makeCustomerUrl(
          getConcatenatedUrl(record.project.code, record.project.name),
          getConcatenatedUrl(record.code, text),
        )}
        className={styles.listingLink}
        data-test-selector="customer-facility-list-item"
      >
        {text}
      </Link>
    ),
    sorter: (a, b) => a.name.localeCompare(b.name),
  },
  {
    title: 'Site',
    dataIndex: 'site',
    key: 'site',
    width: '5%',
    className: styles.hiddenMd,
    sorter: (a, b) => a.site && a.site.localeCompare(b.site),
  },
  {
    title: 'Type',
    dataIndex: "facets['facility-type']",
    key: 'type',
    width: '5%',
    className: styles.hiddenSm,
    sorter: (a, b) =>
      a.facets['facility-type'] &&
      a.facets['facility-type'].localeCompare(b.facets['facility-type']),
  },
  {
    title: 'Postcode',
    dataIndex: 'facets.postcode',
    key: 'postcode',
    width: '5%',
    sorter: (a, b) => a.facets.postcode && a.facets.postcode.localeCompare(b.facets.postcode),
  },
  {
    title: 'Assets',
    dataIndex: 'assets',
    key: 'assets',
    width: '5%',
    className: `${styles.rightAlign} ${styles.hiddenXl}`,
    render: text => (
      <span data-test-selector="facility_assets">{text && text.toLocaleString()}</span>
    ),
    sorter: (a, b) => a.assets - b.assets,
  },
  {
    title: 'Backlog',
    dataIndex: 'backlog',
    key: 'backlog',
    width: '5%',
    className: styles.hiddenXxl,
    sorter: (a, b) => a.backlog && a.backlog.localeCompare(b.backlog),
  },
  {
    title: (
      <div>
        GIA M<sup>2</sup>
      </div>
    ),
    dataIndex: "facets['facility-gia']",
    key: 'gia',
    width: '5%',
    className: styles.hiddenXxl,
    sorter: (a, b) =>
      a.facets['facility-gia'] && a.facets['facility-gia'].localeCompare(b.facets['facility-gia']),
  },
  {
    title: 'Date',
    dataIndex: "facets['build-date']",
    key: 'buildDate',
    className: styles.hiddenXxl,
    render: text => text && getBrowserLocaledDateTimeString(text, true),
    sorter: (a, b) =>
      a.facets['build-date'] && a.facets['build-date'].localeCompare(b.facets['build-date']),
  },
]

class Antd extends CommonPage {
  state = {
    statusFilter: [],
    viewMode: getViewMode(),
    sortOption: {
      isAscending: true,
      field: 'name',
    },
  }

  onFilterKeysChanged = values => {
    this.setState({ filterKeys: values })
  }

  onGoFacility = itemData => {
    const { history } = this.props
    history.push(
      makeCustomerUrl(
        getConcatenatedUrl(itemData.project.code, itemData.project.name),
        getConcatenatedUrl(itemData.code, itemData.name),
      ),
    )
  }

  onStatusFilterChanged = values => {
    this.setState({ statusFilter: values })
  }

  render() {
    const { viewMode, sortOption, statusFilter } = this.state
    const { facilities } = this.props

    const filteredFacilities = filterData(facilities, { status: statusFilter })
    const sortedData = sort(filteredFacilities, sortOption.field, sortOption.isAscending)
    const newColumns = columns.map(column => {
      if (column.dataIndex === sortOption.field) {
        return { ...column, sortOrder: sortOption.isAscending ? 'ascend' : 'descend' }
      }
      return column
    })
    const tableContent = (
      <div className={styles.facilitiesContainer}>
        {viewMode ? (
          <FacilitiesTable
            data={sortedData}
            columns={newColumns}
            onChangeSortBy={this.onChangeSortBy}
            hideActions
          />
        ) : (
          <FacilitiesCardList data={sortedData} onPrimaryAction={this.onGoFacility} />
        )}
      </div>
    )

    return (
      <div>
        <Helmet title="Facilities - All facilities" />
        <section className="card">
          <div className="card-body">
            {this.renderCardHeader({
              columns,
              styles,
              addBtnTitle: null,
              dataTestSelector: '',
              showStatusFilter: true,
              statusList: ['NOT_STARTED', 'IN_PROGRESS', 'DONE'],
            })}
            {renderCollapseComponent({
              styles,
              key: 'facilities',
              headerCurrent: 'Facilities - All facilities',
              headerParent: undefined,
              numberOfResults: facilities.length,
              tableContent,
            })}
          </div>
        </section>
      </div>
    )
  }
}

export default Antd
