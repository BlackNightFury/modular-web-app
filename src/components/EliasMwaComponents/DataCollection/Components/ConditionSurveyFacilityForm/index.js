import React from 'react'
import { Input, Button, Form, Select, Dropdown, Icon, Menu, Radio, Checkbox } from 'antd'
import SearchableTree from '@/components/EliasMwaComponents/Host/SearchableTree'

import PhotoTaker from '../PhotoTaker'
import ReminderNote from '../ReminderNote'

import styles from './style.scss'

const FormItem = Form.Item
const ButtonGroup = Button.Group
const { Option } = Select
const { TextArea } = Input
const RadioGroup = Radio.Group

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field])
}

class ConditionSurveyFacilityForm extends React.Component {
  state = {
    isDisabled: false,
    GIA: '',
    conditionNotes: '',
    selectedPhotos: [],
    isImageRestricted: false,
  }

  componentDidMount() {
    const { images } = this.props

    this.setState({ selectedPhotos: images || [] })
  }

  componentDidUpdate(prevProps) {
    const { initialValue, form, images } = this.props

    if (initialValue !== prevProps.initialValue) {
      form.resetFields()
      this.setState({
        isDisabled: false,
        GIA: '',
        conditionNotes: '',
        selectedPhotos: images || [],
        isImageRestricted: false,
      })
    }
  }

  onPhotoSelected = dataUri => {
    const { user } = this.props
    const tenant = user ? user.tenant : {}
    const { selectedPhotos } = this.state
    const type = dataUri.split(';')[0].split('/')[1]
    const key = `${new Date().getTime()}.${type}`
    this.setState({
      selectedPhotos: [
        ...selectedPhotos,
        {
          dataUri,
          picture: {
            bucket: tenant.assetImagesS3Bucket,
            key,
          },
        },
      ],
    })
  }

  onDeletePhoto = idx => {
    const { selectedPhotos } = this.state
    selectedPhotos.splice(idx, 1)
    this.setState({
      selectedPhotos: [...selectedPhotos],
    })
  }

  handleSubmit = e => {
    e.preventDefault()
    const { form, handleSubmit } = this.props
    const { GIA, conditionNotes, selectedPhotos } = this.state
    form.validateFields((err, values) => {
      if (!err) {
        this.setState({ isDisabled: true })
        const reminder = this.reminderNote.getNotes()
        handleSubmit({
          ...values,
          GIA,
          conditionNotes,
          images: selectedPhotos,
          notes: { reminder },
        })
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

  handleMenuClick = () => {}

  render() {
    const { form, initialValue, onClose, readOnly, treeData } = this.props
    const { getFieldDecorator, getFieldsError } = form
    const { isDisabled, selectedPhotos, isImageRestricted, GIA, conditionNotes } = this.state

    const conditionTypes = ['A', 'B', 'C', 'D']
    const priorityTypes = ['P1', 'P2', 'P3', 'P4']
    const OPTIONS = ['Seen', 'Un-seen']

    const menu = <Menu className={styles.dropDownMenu} onClick={this.handleMenuClick} />

    return (
      <div className={styles.content}>
        <Form layout="vertical" onSubmit={this.handleSubmit}>
          <FormItem label="Element Type" className={styles.formItem} hasFeedback>
            {getFieldDecorator('elementType', {
              initialValue: initialValue && initialValue.conditionSurveyType,
              rules: [{ required: true, message: 'Please select element type' }],
            })(
              <SearchableTree
                customStyle={{ fontSize: '12px' }}
                data-test-selector="assetform_asset_type"
                placeholder="Please select"
                searchPlaceholder="Search asset type..."
                treeData={treeData}
                className={styles.assetTypes}
              />,
            )}
          </FormItem>
          <FormItem label="GIA %" className={styles.formItem} hasFeedback>
            <Input
              placeholder="10"
              disabled={readOnly}
              onChange={e => this.setState({ GIA: e.target.value })}
              value={GIA}
              data-test-selector="conditionsurvey_GIA"
              autoComplete="off"
            />
          </FormItem>
          <Form.Item label="Codition" className={styles.formItem} hasFeedback>
            {getFieldDecorator('condition', {
              initialValue: initialValue && initialValue.condition,
              rules: [{ required: true, message: 'Please select the condition' }],
            })(
              <Select
                className={styles.fontSize13}
                placeholder="Type"
                disabled={readOnly}
                data-test-selector="csurveyform_type"
              >
                {conditionTypes.map(conditionType => (
                  <Option key={conditionType} value={conditionType}>
                    {conditionType}
                  </Option>
                ))}
              </Select>,
            )}
          </Form.Item>
          <Form.Item label="Condition Notes" className={styles.formItem} hasFeedback>
            <TextArea
              rows={4}
              onChange={e => this.setState({ conditionNotes: e.target.value })}
              value={conditionNotes}
              data-test-selector="condition_notes"
            />
          </Form.Item>
          <PhotoTaker
            photos={selectedPhotos.map(photo =>
              photo.dataUri
                ? photo.dataUri
                : `https://${tenant.assetImagesS3Bucket}.s3.${tenant.region}.amazonaws.com/${photo.picture.key}`,
            )}
            onChange={this.onPhotoSelected}
            onDelete={this.onDeletePhoto}
            readOnly={readOnly}
          />
          <Checkbox
            value={isImageRestricted}
            onChange={event => this.setState({ isImageRestricted: event.target.checked })}
            disabled={readOnly}
          >
            Image restricted
          </Checkbox>
          <Form.Item label="Priority" className={styles.formItem} hasFeedback>
            {getFieldDecorator('priority', {
              initialValue: initialValue && initialValue.priority,
              rules: [{ required: true, message: 'Please select priority' }],
            })(
              <Select
                className={styles.fontSize13}
                placeholder="Priority"
                disabled={readOnly}
                data-test-selector="csurveyfacilityform_type"
              >
                {priorityTypes.map(priorityType => (
                  <Option key={priorityType} value={priorityType}>
                    {priorityType}
                  </Option>
                ))}
              </Select>,
            )}
          </Form.Item>
          <Form.Item label="Inspection type" className={styles.formItem} hasFeedback>
            {getFieldDecorator('inspectionType', {
              initialValue: initialValue && initialValue.inspectionType,
              rules: [{ required: true, message: 'Please select inspection type' }],
            })(
              <RadioGroup disabled={readOnly}>
                {OPTIONS.map(option => (
                  <Radio
                    key={option}
                    value={option}
                    className={styles.bypassRadio}
                    onClick={this.onClick}
                  >
                    {option}
                  </Radio>
                ))}
              </RadioGroup>,
            )}
          </Form.Item>
          <Form.Item label="Surveyor assessment" className={styles.formItem} hasFeedback>
            {getFieldDecorator('surveyorAssessment', {
              initialValue: initialValue && initialValue.surveyorAssessment,
              rules: [{ required: true, message: 'Please select surveyor assessment' }],
            })(<TextArea rows={4} data-test-selector="surveyor_assessment" />)}
          </Form.Item>
          <ReminderNote
            ref={ref => {
              this.reminderNote = ref
            }}
            initialValue={initialValue && initialValue.notes && initialValue.notes.reminder}
          />
          <Form.Item className={`${styles.marginTop30} ${styles.marginBottom20}`}>
            <Button className={styles.btnCancel} onClick={onClose}>
              Cancel
            </Button>
            <ButtonGroup className={styles.btnSpaceGroup}>
              <Button
                htmlType="submit"
                className={styles.btnSpace}
                disabled={readOnly || isDisabled || hasErrors(getFieldsError())}
                data-test-selector="form-submit"
              >
                Save element
              </Button>
              <Dropdown className={styles.dropDownSpace} overlay={menu} trigger={['click']}>
                <Button>
                  <Icon type="ellipsis" />
                </Button>
              </Dropdown>
            </ButtonGroup>
          </Form.Item>
        </Form>
      </div>
    )
  }
}

export default Form.create({
  name: 'ConditionSurveyFacilityForm',
})(ConditionSurveyFacilityForm)
