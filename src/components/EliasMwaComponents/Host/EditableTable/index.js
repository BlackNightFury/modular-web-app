import React from 'react'
import { Table } from 'antd'
import { EditableFormRow, EditableCell } from './EditableCell'

class EditableTable extends React.Component {
  render() {
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    }
    const { columns, handleSave } = this.props
    const cols = columns.map(col => {
      if (!col.editable) {
        return col
      }
      return {
        ...col,
        onCell: record => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave,
        }),
      }
    })

    return (
      <Table
        {...this.props}
        components={components}
        rowClassName={() => 'editable-row'}
        bordered
        columns={cols}
      />
    )
  }
}

export default EditableTable
