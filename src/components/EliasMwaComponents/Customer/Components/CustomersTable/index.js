import React from 'react'
import { Table, Button } from 'antd'

const ButtonGroup = Button.Group
class CustomersTable extends React.Component {
  static defaultProps = {
    data: [],
  }

  render() {
    const { data } = this.props

    const columns = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: 'Last Update',
        dataIndex: 'last_update',
        key: 'last_update',
        sorter: (a, b) => new Date(b.last_update) - new Date(a.last_update),
      },
      {
        title: 'Facilities',
        dataIndex: 'facilities',
        key: 'facilities',
        render: text => text && text.toLocaleString(),
      },
      {
        title: '',
        key: 'action',
        render: (dataProps, record, index) => (
          <ButtonGroup>
            <Button
              onClick={() => {
                if (index !== 0) {
                  alert('Please use first item in grid') //eslint-disable-line
                }
              }}
            >
              Actions
            </Button>
          </ButtonGroup>
        ),
      },
    ]

    return (
      <Table
        rowKey="key"
        className="utils__scrollTable"
        scroll={{ x: '100%' }}
        columns={columns}
        dataSource={data}
      />
    )
  }
}

export default CustomersTable
