import React from 'react'
import { connect } from 'dva'
import { withRouter } from 'dva/router'
import classNames from 'classnames'
import { getFacilityIds, getNumberOfRecordsInFacilityByType } from '@/utils/elasticsearch'
import FacilityInfoTable from '../../Components/FacilityInfoTable'
import { sort } from '@/services/utils'

import styles from './style.scss'

export class Antd extends React.Component {
  state = {
    numberOfRecordsByFacility: [],
    sortOption: {
      isAscending: false,
      field: 'facilityId',
    },
  }

  columns = [
    {
      title: 'facilityId.keyword',
      dataIndex: 'facilityId',
      key: 'facilityId',
      width: '40%',
      sorter: (a, b) => a.facilityId.localeCompare(b.facilityId),
    },
    {
      title: 'Floors',
      dataIndex: 'floor',
      key: 'floor',
      width: '30%',
      render: text => text || 0,
      sorter: (a, b) => (a.floor || 0) - (b.floor || 0),
    },
    {
      title: 'Assets',
      dataIndex: 'asset',
      key: 'asset',
      width: '30%',
      render: text => (
        <div className={styles.clickable} onClick={this.goToMyAssets} role="presentation">
          {text || 0}
        </div>
      ),
      sorter: (a, b) => (a.asset || 0) - (b.asset || 0),
    },
  ]

  componentDidMount() {
    const {
      user: { tenantId },
    } = this.props

    getFacilityIds(tenantId).then(async facilityIds => {
      const numberOfRecordsPromises = facilityIds.map(facilityId =>
        getNumberOfRecordsInFacilityByType(tenantId, facilityId),
      )

      Promise.all(numberOfRecordsPromises)
        .then(numberOfRecordsByFacility => {
          this.setState({ numberOfRecordsByFacility })
        })
        .catch(() => {
          this.setState({
            numberOfRecordsByFacility: [],
          })
        })
    })
  }

  goToMyAssets = () => {
    const { history } = this.props
    history.push('/my-estate/assets')
  }

  onChangeSortBy = (field, isAscending) => {
    if (field && isAscending) {
      this.setState({ sortOption: { isAscending, field } })
    } else {
      const { sortOption } = this.state
      this.setState({
        sortOption: {
          isAscending: field ? isAscending : !sortOption.isAscending,
          field: field || sortOption.field,
        },
      })
    }
  }

  render() {
    const { numberOfRecordsByFacility, sortOption } = this.state
    const sortedData = sort(numberOfRecordsByFacility, sortOption.field, sortOption.isAscending)
    return (
      <div className={classNames('analyticsCard', styles.assetReplacementCard)}>
        <p>Table: Facilities</p>
        <FacilityInfoTable
          columns={this.columns}
          data={sortedData}
          onChangeSortBy={this.onChangeSortBy}
        />
      </div>
    )
  }
}

const mapStateToProps = ({ user }) => ({ user })
export default withRouter(connect(mapStateToProps)(Antd))
