import React from 'react'
import { Table } from 'antd'

class MessageTable extends React.Component {
  static defaultProps = {
    data: [],
  }

  render() {
    const { data } = this.props

    const columns = [
      {
        title: 'From',
        dataIndex: 'from',
        key: 'from',
        sorter: (a, b) => a.from.length - b.from.length,
      },
      {
        title: 'Date',
        dataIndex: 'date',
        key: 'date',
      },
      {
        title: 'Message',
        dataIndex: 'message',
        key: 'message',
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

export default MessageTable
