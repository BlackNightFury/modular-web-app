import React from 'react'
import { Input, Button, Form, Select } from 'antd'
import { mappingStatusText, capitalize } from '@/services/utils'
import ReminderNote from '../ReminderNote'
import WarningCard from '../WarningCard'
import styles from './style.scss'

const FormItem = Form.Item
const { Option } = Select

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field])
}

class FloorForm extends React.Component {
  static defaultProps = {
    submitBtnLabel: 'Add Floor',
  }

  state = {
    isDisabled: false,
  }

  componentDidUpdate(prevProps) {
    const { initialValue, form } = this.props

    if (initialValue !== prevProps.initialValue) {
      this.setState({ isDisabled: false })
      form.resetFields()
    }
  }

  handleSubmit = e => {
    e.preventDefault()

    const { form, handleSubmit, onClose } = this.props
    form.validateFields((err, values) => {
      if (!err) {
        this.setState({ isDisabled: true })
        const reminder = this.reminderNote.getNotes()
        handleSubmit({ ...values, notes: { reminder }, status: values.status })
        onClose()
      }
    })
  }

  scrollTo = id => {
    const targetEle = document.querySelectorAll(`.scroll-selector-${id}`)[0]
    const formDrawerEle = targetEle.closest(`.form-drawer-content`)
    if (formDrawerEle && targetEle) {
      formDrawerEle.scrollTo({
        top: targetEle.offsetTop - 10,
        left: 0,
        behavior: 'smooth',
      })
    }
  }

  scrollToBottom = () => {
    const targetEle = document.querySelectorAll(`.scroll-selector-name`)[0]
    if (targetEle) {
      const formDrawerEle = targetEle.closest(`.form-drawer-content`)
      if (formDrawerEle) {
        formDrawerEle.scrollTo({
          top: formDrawerEle.scrollHeight,
          left: 0,
          behavior: 'smooth',
        })
      }
    }
  }

  onSubmit = () => {
    const { form } = this.props
    const { getFieldsError } = form
    const errorsList = getFieldsError()
    const errorFields = Object.keys(errorsList)
    setTimeout(() => {
      if (errorFields.length === 1) {
        this.scrollTo(errorFields[0])
      } else {
        this.scrollToBottom()
      }
    }, 100)
  }

  render() {
    const { form, initialValue, submitBtnLabel, onClose, readOnly } = this.props
    const { getFieldDecorator, getFieldsError } = form
    const { isDisabled } = this.state
    const errorsList = getFieldsError()
    const errorFields = Object.keys(errorsList)
    const errorCount = errorFields.filter(key => errorsList[key] && errorsList[key].length > 0)
      .length

    return (
      <div className={styles.content}>
        <Form layout="vertical" onSubmit={this.handleSubmit} data-test-selector="FloorForm">
          <FormItem label="Name" className={`scroll-selector-name ${styles.formItem}`} hasFeedback>
            {getFieldDecorator('name', {
              initialValue: initialValue && initialValue.name,
              rules: [{ required: true, message: 'Please input the floor name!' }],
            })(
              <Input
                placeholder="Floor Name"
                disabled={readOnly}
                data-test-selector="FloorForm_name"
                autoComplete="off"
              />,
            )}
          </FormItem>
          <Form.Item
            label="Status"
            className={`scroll-selector-status ${styles.formItem}`}
            hasFeedback
          >
            {getFieldDecorator('status', {
              initialValue: initialValue && initialValue.status,
              rules: [{ required: true, message: 'Please select the status' }],
            })(
              <Select
                className={styles.fontSize13}
                placeholder="Status"
                disabled={readOnly}
                data-test-selector="FloorForm_status"
              >
                {['NOT_STARTED', 'IN_PROGRESS', 'DONE'].map(status => (
                  <Option value={status}>{mappingStatusText[status]}</Option>
                ))}
              </Select>,
            )}
          </Form.Item>
          <ReminderNote
            ref={ref => {
              this.reminderNote = ref
            }}
            initialValue={initialValue && initialValue.notes && initialValue.notes.reminder}
          />
          <div
            className={`has-error ${styles.marginTop30}`}
            data-test-selector="floorform-errorslist"
          >
            {errorCount > 0 && (
              <WarningCard
                message="Validation issues"
                description={
                  <div>
                    {errorFields.map(
                      field =>
                        errorsList[field] && (
                          <div
                            key={field}
                            className={`form-validation-error-text ant-form-explain ${styles.marginTop4} ${styles.errorAnchor}`}
                            onClick={() => this.scrollTo(field)}
                            onKeyDown={() => {}}
                            role="button"
                            tabIndex="0"
                          >
                            {capitalize(field)}: {errorsList[field]}
                          </div>
                        ),
                    )}
                  </div>
                }
                type="create-form"
                show
                dataTestSelector="create-floor-form-validation-card"
              />
            )}
          </div>
          <Form.Item className={`${styles.marginTop30} ${styles.marginBottom20}`}>
            <Button
              data-test-selector="floor-form-cancel"
              className={styles.btnCancel}
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              className={styles.btnSubmit}
              htmlType="submit"
              disabled={readOnly || isDisabled || hasErrors(getFieldsError())}
              data-test-selector="floor-form-submit"
              onClick={this.onSubmit}
            >
              {submitBtnLabel}
            </Button>
          </Form.Item>
        </Form>
      </div>
    )
  }
}

export default Form.create({
  name: 'FloorForm',
})(FloorForm)
