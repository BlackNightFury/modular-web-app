import React from 'react'
import { Input, Button, Form, Select, DatePicker, Dropdown, Icon, Menu } from 'antd'
import moment from 'moment'
import ReminderNote from '../ReminderNote'
import WarningCard from '../WarningCard'
import { getLocalDateTimeFormat } from '@/services/datetime'
import { makeSurveyUrl, getConcatenatedUrl, mappingStatusText, capitalize } from '@/services/utils'

import styles from './style.scss'

const FormItem = Form.Item
const ButtonGroup = Button.Group
const { Option } = Select

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field])
}

class SpaceForm extends React.Component {
  static defaultProps = {
    submitBtnLabel: 'Add space',
  }

  state = {
    isDisabled: false,
  }

  componentDidUpdate(prevProps) {
    const { initialValue, form } = this.props

    if (initialValue !== prevProps.initialValue) {
      this.setState({ isDisabled: false }) //eslint-disable-line
      form.resetFields()
    }
  }

  validateDate = (rule, value, callback) => {
    const today = new Date()

    if (value && value <= today) {
      callback('Date must be future')
      return
    }
    callback()
  }

  handleSubmit = (e, addAsset) => {
    e.preventDefault()
    const { form, handleSubmit, onClose } = this.props
    form.validateFields((err, values) => {
      if (!err) {
        this.setState({ isDisabled: true })
        const reminder = this.reminderNote.getNotes()
        const spaceId = handleSubmit({
          ...values,
          notes: { reminder },
          status: values.status,
        })
        onClose()

        if (addAsset) {
          const { facilityName, floorName, projectName, history } = this.props

          history.push({
            pathname: makeSurveyUrl(
              projectName,
              facilityName,
              floorName,
              getConcatenatedUrl(spaceId, values.name),
            ),
            action: 'openDrawer',
          })
        }
      }
    })
  }

  onStatusChanged = value => {
    const { form } = this.props

    if (value !== 'INACCESSIBLE') {
      form.setFields({
        availableDate: { value: form.getFieldValue('availableDate'), errors: undefined },
      })
    }
  }

  handleMenuClick = e => {
    this.handleSubmit(e.domEvent, true)
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
    const {
      form,
      initialValue,
      submitBtnLabel,
      spaceTypes,
      onClose,
      readOnly,
      projectId,
    } = this.props
    const { getFieldDecorator, getFieldsError } = form
    const { isDisabled } = this.state

    const errorsList = getFieldsError()
    const errorFields = Object.keys(errorsList)
    const errorCount = errorFields.filter(key => errorsList[key] && errorsList[key].length > 0)
      .length

    const { status } = { ...initialValue, ...form.getFieldsValue() }

    const projectSpaceTypes = spaceTypes[projectId] || []

    const addSpaceDisabled = readOnly || isDisabled || hasErrors(getFieldsError())
    const menu = (
      <Menu className={styles.dropDownMenu} onClick={!addSpaceDisabled && this.handleMenuClick}>
        <Menu.Item
          key="clone"
          className={addSpaceDisabled ? styles.disabledDropDownMenuItem : styles.dropDownMenuItem}
          data-test-selector="spaceform_saveandaddasset"
        >
          Create new space and add asset
        </Menu.Item>
      </Menu>
    )

    return (
      <div className={styles.content}>
        <Form layout="vertical" onSubmit={this.handleSubmit}>
          <FormItem label="Name" className={`scroll-selector-name ${styles.formItem}`} hasFeedback>
            {getFieldDecorator('name', {
              initialValue: initialValue && initialValue.name,
              rules: [{ required: true, message: 'Please input the space name!' }],
            })(
              <Input
                placeholder="Space Name"
                disabled={readOnly}
                data-test-selector="spaceform_name"
                autoComplete="off"
              />,
            )}
          </FormItem>
          <FormItem
            label="Local name"
            className={`scroll-selector-localName ${styles.formItem}`}
            hasFeedback
          >
            {getFieldDecorator('localName', {
              initialValue: initialValue && initialValue.localName,
              rules: [{ required: false, message: 'Please input the local space name!' }],
            })(
              <Input
                placeholder="Local name"
                disabled={readOnly}
                data-test-selector="spaceform_localname"
                autoComplete="off"
              />,
            )}
          </FormItem>
          <FormItem
            label="Department"
            className={`scroll-selector-department ${styles.formItem}`}
            hasFeedback
          >
            {getFieldDecorator('department', {
              initialValue: initialValue && initialValue.department,
              rules: [{ required: false, message: 'Please input the department!' }],
            })(
              <Input
                placeholder="Department"
                disabled={readOnly}
                data-test-selector="spaceform_department"
                autoComplete="off"
              />,
            )}
          </FormItem>
          <Form.Item label="Type" className={`scroll-selector-type ${styles.formItem}`} hasFeedback>
            {getFieldDecorator('type', {
              initialValue: initialValue && initialValue.type,
              rules: [{ required: true, message: 'Please select the space type' }],
            })(
              <Select
                className={styles.fontSize13}
                placeholder="Type"
                disabled={readOnly}
                data-test-selector="spaceform_type"
              >
                {projectSpaceTypes.map(spaceType => (
                  <Option key={spaceType} value={spaceType}>
                    {spaceType}
                  </Option>
                ))}
              </Select>,
            )}
          </Form.Item>
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
                onChange={this.onStatusChanged}
                disabled={readOnly}
                data-test-selector="spaceform_status"
              >
                {['NOT_STARTED', 'INACCESSIBLE', 'IN_PROGRESS', 'DONE'].map(statusValue => (
                  <Option value={statusValue}>{mappingStatusText[statusValue]}</Option>
                ))}
              </Select>,
            )}
          </Form.Item>
          {status === 'INACCESSIBLE' && (
            <Form.Item
              label="Available Date"
              className={`scroll-selector-availableDate ${styles.formItem}`}
              hasFeedback
            >
              {getFieldDecorator('availableDate', {
                initialValue:
                  initialValue && initialValue.availableDate
                    ? moment(initialValue.availableDate)
                    : undefined,
                rules: [
                  {
                    required: true,
                    message: 'Please select the available date',
                  },
                  {
                    validator: this.validateDate,
                  },
                ],
              })(
                <DatePicker
                  style={{ width: '100%' }}
                  placeholder="Available Date"
                  format={getLocalDateTimeFormat('L')}
                  disabledDate={date => new Date(date) < Date.now()}
                  showToday={false}
                  disabled={readOnly}
                />,
              )}
            </Form.Item>
          )}
          <ReminderNote
            ref={ref => {
              this.reminderNote = ref
            }}
            initialValue={initialValue && initialValue.notes && initialValue.notes.reminder}
          />
          <div
            className={`has-error ${styles.marginTop30}`}
            data-test-selector="spaceform-errorslist"
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
                dataTestSelector="create-space-form-validation-card"
              />
            )}
          </div>
          <Form.Item className={`${styles.marginTop30} ${styles.marginBottom20}`}>
            <Button className={styles.btnCancel} onClick={onClose}>
              Cancel
            </Button>
            <ButtonGroup className={styles.btnSpaceGroup}>
              <Button
                htmlType="submit"
                className={styles.btnSpace}
                disabled={addSpaceDisabled}
                data-test-selector="form-submit"
                onClick={this.onSubmit}
              >
                {submitBtnLabel}
              </Button>
              {submitBtnLabel === 'Add space' && (
                <Dropdown className={styles.dropDownSpace} overlay={menu} trigger={['click']}>
                  <Button data-test-selector="spaceform_multiactionopen">
                    <Icon type="ellipsis" />
                  </Button>
                </Dropdown>
              )}
            </ButtonGroup>
          </Form.Item>
        </Form>
      </div>
    )
  }
}

export default Form.create({
  name: 'SpaceForm',
})(SpaceForm)
