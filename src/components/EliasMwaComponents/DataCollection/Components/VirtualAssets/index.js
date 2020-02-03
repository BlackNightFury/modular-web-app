import React from 'react'
import { Input, Button, Select, Form } from 'antd'
import VirtualAssetsTable from '@/components/EliasMwaComponents/DataCollection/Components/VirtualAssetsTable'
import table from './data.json'

const FormItem = Form.Item
const { Option } = Select

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field])
}

@Form.create()
class VirtualAssets extends React.Component {
  state = {
    virtualassets: table.virtualassets,
  }

  handleSave = row => {
    const { virtualassets } = this.state
    const newData = [...virtualassets]
    const index = newData.findIndex(item => row.key === item.key)
    const item = newData[index]
    newData.splice(index, 1, {
      ...item,
      ...row,
    })

    this.setState({ virtualassets: newData })
  }

  handleSubmit = e => {
    e.preventDefault()
    const { form } = this.props
    form.validateFields((err, values) => {
      if (!err) {
        const { virtualassets } = this.state
        this.setState({
          virtualassets: [
            ...virtualassets,
            {
              key: virtualassets.length + 1,
              ...values,
            },
          ],
        })
      }
    })
  }

  render() {
    const { form } = this.props
    const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = form

    const { virtualassets } = this.state

    const installYearError = isFieldTouched('install_year') && getFieldError('install_year')
    const quantityError = isFieldTouched('quantity') && getFieldError('quantity')

    return (
      <div>
        <VirtualAssetsTable data={virtualassets} handleSave={this.handleSave} />
        <Form layout="vertical" onSubmit={this.handleSubmit}>
          <Form.Item label="Asset Type" hasFeedback>
            {getFieldDecorator('asset_subtype', {
              rules: [{ required: true, message: 'Please select asset type!' }],
            })(
              <Select
                showSearch
                placeholder="Select asset type"
                defaultActiveFirstOption={false}
                showArrow={false}
                filterOption={false}
                notFoundContent={null}
              >
                <Option key="Fire extinguishers - water">Fire extinguishers - water</Option>
              </Select>,
            )}
          </Form.Item>
          <FormItem
            label="Install Year"
            validateStatus={installYearError ? 'error' : 'success'}
            help={installYearError || ''}
          >
            {getFieldDecorator('install_year', {
              rules: [{ required: true, message: 'Please input the Install Year!' }],
            })(<Input placeholder="Install Year" autoComplete="off" />)}
          </FormItem>
          <Form.Item label="Condition" hasFeedback>
            {getFieldDecorator('condition', { initialValue: 'A' })(
              <Select>
                <Option value="A">A</Option>
                <Option value="B">B</Option>
                <Option value="C">C</Option>
              </Select>,
            )}
          </Form.Item>
          <FormItem
            label="Quantity"
            validateStatus={quantityError ? 'error' : 'success'}
            help={quantityError || ''}
          >
            {getFieldDecorator('quantity', {
              rules: [{ required: true, message: 'Please input the Quantity!' }],
            })(<Input placeholder="Quantity" autoComplete="off" />)}
          </FormItem>
          <Form.Item>
            <Button type="primary" htmlType="submit" disabled={hasErrors(getFieldsError())}>
              Add
            </Button>
          </Form.Item>
        </Form>
      </div>
    )
  }
}

export default VirtualAssets
