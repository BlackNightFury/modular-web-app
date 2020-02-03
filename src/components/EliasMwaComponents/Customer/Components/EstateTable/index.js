import React from 'react'
import { Table } from 'antd'
import style from './style.scss'

const rag = ['red', '#FFBF00', 'green']

class EstateTable extends React.Component {
  static defaultProps = {
    data: [],
    projectName: '',
    facilityName: '',
  }

  render() {
    const { data } = this.props

    const columns = [
      {
        title: 'Location',
        dataIndex: 'location',
        key: 'location',
      },
      {
        title: 'Postcode',
        dataIndex: 'postcode',
        key: 'postcode',
      },
      {
        title: 'Bu',
        dataIndex: 'bu',
        key: 'bu',
        sorter: (a, b) => a.bu - b.bu,
      },
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: 'GIA',
        dataIndex: 'gia',
        key: 'gia',
        render: text => text && text.toLocaleString(),
      },
      {
        title: 'Backlog',
        dataIndex: 'backlog',
        key: 'backlog',
        render: text => text && text.toLocaleString(),
      },
      {
        title: 'RAG',
        dataIndex: 'rag',
        key: 'rag',
        render: text => <div className={style.rag} style={{ backgroundColor: rag[text] }} />,
        sorter: (a, b) => b.rag - a.rag,
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

export default EstateTable
