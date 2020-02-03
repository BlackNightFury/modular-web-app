import React from 'react'
import { Table, Button } from 'antd'
import { connect } from 'dva'

const ButtonGroup = Button.Group
const mapStateToProps = ({ user }) => ({ authUser: user })
@connect(mapStateToProps)
class LinkedAssetsTable extends React.Component {
  static defaultProps = {
    data: [],
  }

  render() {
    const { data } = this.props

    const columns = [
      {
        title: 'Asset subtype',
        dataIndex: 'subtype',
        key: 'subtype',
      },
      {
        title: '',
        key: 'action',
        render: () => (
          <ButtonGroup>
            <Button
              onClick={() => {
                alert('TODO') //eslint-disable-line
              }}
            >
              Add
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

export default LinkedAssetsTable
