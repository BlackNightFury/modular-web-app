import React from 'react'
import { Table } from 'antd'
import InfiniteScrollWithMore from '@/components/EliasMwaComponents/DataCollection/Components/InfiniteScrollWithMore'

class FacilityInfoTable extends InfiniteScrollWithMore {
  static defaultProps = {
    data: [],
  }

  render() {
    const { columns, onChangeSortBy } = this.props
    const { visibleData } = this.state

    return (
      <>
        <Table
          rowKey="facilityId"
          className="facilityInfo__scrollTable"
          scroll={{ x: '100%' }}
          columns={columns}
          dataSource={visibleData}
          pagination={false}
          data-test-selector="facility_info_table"
          onRow={() => ({
            'data-test-selector': 'facility_info_table_row',
          })}
          onChange={(pagination, filter, sorter) => {
            onChangeSortBy(sorter.field, sorter.order === 'ascend')
          }}
        />
        {super.render()}
      </>
    )
  }
}

export default FacilityInfoTable
