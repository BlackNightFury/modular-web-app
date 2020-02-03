import React from 'react'
import { Checkbox, Button, Form } from 'antd'
import styles from './style.scss'

const FormItem = Form.Item
const ButtonGroup = Button.Group

class CopyAssetsForm extends React.Component {
  state = {
    checkedItems: [],
  }

  componentDidUpdate(prevProps) {
    const { items, form } = this.props

    if (items !== prevProps.items) {
      form.resetFields()
    }
  }

  handleSubmit = e => {
    e.preventDefault()
    const { handleSubmit } = this.props
    const { checkedItems } = this.state
    handleSubmit(checkedItems)
  }

  onChange = e => {
    const { items } = this.props
    const { checkedItems } = this.state
    let newCheckedItems = checkedItems
    if (e.target.checked) {
      const filterItems = items.filter(item => item.id === e.target.id)
      newCheckedItems.push(filterItems[0])
    } else {
      newCheckedItems = checkedItems.filter(item => item.id !== e.target.id)
    }
    this.setState({ checkedItems: newCheckedItems })
  }

  render() {
    const { onClose, items } = this.props

    return (
      <div className={styles.content}>
        <Form layout="vertical" onSubmit={this.handleSubmit}>
          {items.map(item => (
            <FormItem key={item.id} className={styles.formItem}>
              <Checkbox id={item.id} onChange={this.onChange}>
                <span data-test-selector={item.type}>{item.type}</span>
              </Checkbox>
            </FormItem>
          ))}

          <Form.Item className={`${styles.marginTop30} ${styles.marginBottom20}`}>
            <Button className={styles.btnCancel} onClick={onClose}>
              Cancel
            </Button>
            <ButtonGroup className={styles.btnCopyGroup}>
              <Button
                htmlType="submit"
                className={styles.btnCopy}
                // disabled={!checkedItems.length}
                data-test-selector="form-submit"
              >
                Copy
              </Button>
            </ButtonGroup>
          </Form.Item>
        </Form>
      </div>
    )
  }
}

export default Form.create({
  name: 'CopyAssetsForm',
})(CopyAssetsForm)
