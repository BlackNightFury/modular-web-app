import React from 'react'
import { Button, Input } from 'antd'
import EditableTable from '@/components/EliasMwaComponents/Host/EditableTable'
import InfiniteScrollWithMore from '../InfiniteScrollWithMore'
import style from './style.scss'

const ButtonGroup = Button.Group

class VirtualAssetsTable extends InfiniteScrollWithMore {
  static defaultProps = {
    data: [],
  }

  render() {
    const { handleSave } = this.props
    const { visibleData } = this.state

    const columns = [
      {
        title: 'Asset subtype',
        dataIndex: 'asset_subtype',
        key: 'asset_subtype',
        editable: true,
        width: '30%',
      },
      {
        title: 'Install Year',
        dataIndex: 'install_year',
        key: 'install_year',
        editable: true,
        width: '10%',
      },
      {
        title: 'Condition',
        dataIndex: 'condition',
        key: 'condition',
        editable: true,
        width: '10%',
      },
      {
        title: 'Quantity',
        dataIndex: 'quantity',
        key: 'quantity',
        editable: true,
        width: '10%',
      },
      {
        title: '',
        key: 'action',
        render: row => {
          let inputbox

          return (
            <div>
              <ButtonGroup>
                <Button
                  onClick={() =>
                    handleSave({
                      ...row,
                      quantity: row.quantity + parseInt(inputbox.input.value, 10),
                    })
                  }
                >
                  Add
                </Button>
              </ButtonGroup>
              <Input
                defaultValue={0}
                className={style.input}
                ref={ref => {
                  inputbox = ref
                }}
                autoComplete="off"
              />
            </div>
          )
        },
      },
    ]

    return (
      <>
        <EditableTable
          rowKey="key"
          className="utils__scrollTable"
          scroll={{ x: '100%' }}
          columns={columns}
          dataSource={visibleData}
          handleSave={handleSave}
        />
        {super.render()}
      </>
    )
  }
}

export default VirtualAssetsTable
