import React from 'react'
import Form from 'react-jsonschema-form'
import classNames from 'classnames'
import { Input, Select, Checkbox, Button, Radio } from 'antd'
import _ from 'lodash'
import SearchableTree from '@/components/EliasMwaComponents/Host/SearchableTree'
import QuantityIncreaser from '@/components/EliasMwaComponents/DataCollection/Components/QuantitiyIncreaser'
import BarcodeInput from '@/components/EliasMwaComponents/DataCollection/Components/BarcodeInput'
import { flattenToObject, makeSentenceCase, capitalize } from '@/services/utils'
import styles from './style.scss'
import WarningCard from '../WarningCard'
import { getLocalDateTimeFormat } from '@/services/datetime'

const RadioGroup = Radio.Group

const { Option } = Select

export const flattenSchemaErrorsList = (formInfo, validationResult) => {
  const flattenErrorsList = []
  const formGroupNames = Object.keys(formInfo)
  formGroupNames.sort()

  formGroupNames.forEach(groupName => {
    const group = formInfo[groupName].items ? formInfo[groupName].items : formInfo[groupName]
    if (Array.isArray(group)) {
      group.forEach(({ key, element }) => {
        const errorKey = '__errors'
        const itemKey = element ? `${element}.${key}` : key
        const itemValidation = validationResult[groupName] && validationResult[groupName][itemKey]
        if (
          itemValidation &&
          itemValidation[errorKey].length //
        ) {
          flattenErrorsList.push({
            stack: `${itemKey}: ${itemValidation[errorKey][0]}`,
          })
        }
      })
    }
  })
  return flattenErrorsList
}

class AllowByPassWrapper extends React.Component {
  OPTIONS = ['Not Present', 'No Access', 'High Level', 'Data Worn']

  constructor(props) {
    super(props)
    const { label, initialNotes } = props

    if (label === 'barcode') this.OPTIONS = ['No Access', 'High Level']

    this.state = {
      isFocused: false,
      selected: initialNotes,
      autoInputDropdownVisible: false,
    }
  }

  componentWillUnmount() {
    if (this.timeOut) {
      clearTimeout(this.timeOut)
    }
  }

  onFocus = () => {
    this.setState({ isFocused: true })
  }

  onBlur = () => {
    this.timeOut = setTimeout(() => {
      const { autoInputDropdownVisible } = this.state
      if (!autoInputDropdownVisible) this.setState({ isFocused: false })
    }, 500)
  }

  onClick = ({ target }) => {
    const { label, onAllowByPass, onChange, value } = this.props
    const { selected } = this.state

    this.setState({ selected: selected === target.value ? null : target.value })

    onAllowByPass(label, selected === target.value ? undefined : target.value)
    onChange(value)
  }

  onDropdownVisibleChange = visible => {
    this.setState({ autoInputDropdownVisible: visible })
  }

  render() {
    const {
      schema: { allowByPass, disabled },
      children,
    } = this.props

    const cloneChildren = React.cloneElement(
      children,
      children.type.name === 'SearchableTree'
        ? {
            onDropdownVisibleChange: this.onDropdownVisibleChange,
          }
        : null,
    )

    const { isFocused, selected } = this.state
    return (
      <div onFocus={this.onFocus} onBlur={this.onBlur}>
        {cloneChildren}
        {allowByPass && (isFocused || selected) && (
          <RadioGroup disabled={disabled} value={selected} className={styles.margin20}>
            {this.OPTIONS.map(option => (
              <Radio
                key={option}
                value={option}
                className={styles.bypassRadio}
                onClick={this.onClick}
              >
                {option}
              </Radio>
            ))}
          </RadioGroup>
        )}
      </div>
    )
  }
}

const AntInput = ({ value, onChange, id, schema }) => (
  <AllowByPassWrapper
    label={schema.key}
    schema={schema}
    onAllowByPass={schema.onAllowByPass}
    initialNotes={schema.initialNotes}
    onChange={onChange}
    value={value}
  >
    <Input
      id={id}
      type="text"
      className={`${styles.fontSize13} ${styles.marginBottom10}`}
      value={value ? String(value) : value}
      onChange={event => onChange(event.target.value)}
      disabled={schema.disabled}
      autoComplete="off"
    />
  </AllowByPassWrapper>
)

const AntTextAreaInput = ({ value, onChange, id, schema }) => (
  <AllowByPassWrapper
    label={schema.key}
    schema={schema}
    onAllowByPass={schema.onAllowByPass}
    initialNotes={schema.initialNotes}
    onChange={onChange}
    value={value}
  >
    <Input.TextArea
      data-test-selector={`form-multiline-text_${schema.value}`}
      id={id}
      type="text"
      className={`${styles.fontSize13} ${styles.marginBottom10}`}
      value={value ? String(value) : value}
      onChange={event => onChange(event.target.value)}
      disabled={schema.disabled}
      autoComplete="off"
    />
  </AllowByPassWrapper>
)

const AntQuantityBox = ({ value, onChange, id, schema }) => (
  <Input
    id={id}
    type="number"
    value={value ? String(value) : value}
    onChange={event => onChange(event.target.value)}
    disabled={schema.disabled}
    data-test-selector="ant_quantity_box"
    autoComplete="off"
  />
)

const EditQuantityBox = ({ value, onChange, id, schema }) => (
  <div>
    <QuantityIncreaser id={id} value={value} onChange={onChange} disabled={schema.disabled} />
  </div>
)

const BarcodeInputBox = ({ value, onChange, id, schema }) => (
  <AllowByPassWrapper
    label={schema.key}
    schema={schema}
    onAllowByPass={schema.onAllowByPass}
    initialNotes={schema.initialNotes}
    onChange={onChange}
    value={value}
  >
    <BarcodeInput id={id} value={value} onChange={onChange} schema={schema} />
  </AllowByPassWrapper>
)

const AntSelectBox = ({ value: val, options, placeholder, onChange, id, schema }) => (
  <AllowByPassWrapper
    label={schema.key}
    schema={schema}
    onAllowByPass={schema.onAllowByPass}
    initialNotes={schema.initialNotes}
    onChange={onChange}
    value={val}
  >
    <Select
      id={id}
      className={`${styles.fontSize13} ${styles.marginBottom10}`}
      value={val}
      placeholder={placeholder}
      onChange={value => onChange(value)}
      disabled={schema.disabled}
      data-test-selector="ant_select_box"
    >
      {options.enumOptions.map(({ label: labelOption, value }) => (
        <Option value={value} key={value} className={styles.fontSize13}>
          {labelOption}
        </Option>
      ))}
    </Select>
  </AllowByPassWrapper>
)

const AntYearPicker = ({ value, onChange, id, schema }) => (
  <AllowByPassWrapper
    label={schema.key}
    schema={schema}
    onAllowByPass={schema.onAllowByPass}
    initialNotes={schema.initialNotes}
    onChange={onChange}
    value={value}
  >
    <Input
      id={id}
      type="text"
      className={`${styles.fontSize13} ${styles.marginBottom10}`}
      placeholder={
        id === 'root_Others_install-date' && `${getLocalDateTimeFormat('L')} - full or partial date`
      }
      value={value}
      onChange={event => onChange(event.target.value)}
      disabled={schema.disabled}
      data-test-selector="ant_year_picker"
      autoComplete="off"
    />
  </AllowByPassWrapper>
)

const ManufacturerAutoBox = ({ value, onChange, id, schema, onDropdownVisibleChange }) => (
  <AllowByPassWrapper
    label={schema.key}
    schema={schema}
    onAllowByPass={schema.onAllowByPass}
    initialNotes={schema.initialNotes}
    onChange={onChange}
    value={value}
  >
    <SearchableTree
      id={id}
      customStyle={{ fontSize: '12px', marginBottom: '10px' }}
      placeholder="Select"
      searchPlaceholder="Search..."
      treeData={schema.manufacturers}
      alias={schema.alias}
      onSelect={key => {
        onChange(makeSentenceCase(key))
      }}
      getPopupContainer={trigger => trigger.parentNode}
      value={value}
      limit={5}
      autoComplete
      onDropdownVisibleChange={onDropdownVisibleChange}
      disabled={schema.disabled}
    />
  </AllowByPassWrapper>
)

const AntCheckBox = ({ value, onChange, id, schema }) => (
  <AllowByPassWrapper
    label={schema.key}
    schema={schema}
    onAllowByPass={schema.onAllowByPass}
    initialNotes={schema.initialNotes}
    onChange={onChange}
    value={value}
  >
    <Checkbox
      id={id}
      data-test-selector={`form-checkbox_${schema.value}`}
      className={styles.marginBottom10}
      checked={value === 'checked'}
      onChange={e => onChange(e.target.checked ? 'checked' : 'unchecked')}
      disabled={schema.disabled}
    >
      {schema.inline && schema.text}
    </Checkbox>
  </AllowByPassWrapper>
)

const AntLink = ({ value }) => {
  const jsonValue = JSON.parse(value)
  return (
    <div className={styles.linkContainer}>
      {_.keys(jsonValue).map((key, index) => (
        <a
          className="underline"
          key={index}
          href={jsonValue[key].url}
          target="_blank"
          rel="noopener noreferrer"
          data-test-selector="contextpanel_project_docs"
        >
          {jsonValue[key].text}
        </a>
      ))}
    </div>
  )
}

const AntWidgets = {
  TextBox: AntInput,
  EditQuantityBox,
  QuantityBox: AntQuantityBox,
  MultiLineTextBox: AntTextAreaInput,
  ComboBox: AntSelectBox,
  AutoBox: AntInput,
  ManufacturerAutoBox,
  ComboBoxYear: AntYearPicker,
  BarcodeBox: BarcodeInputBox,
  CheckBox: AntCheckBox,
  DocLink: AntLink,
}

const types = {
  TextBox: 'string',
  EditQuantityBox: 'number',
  QuantityBox: 'number',
  MultiLineTextBox: 'string',
  ManufacturerAutoBox: 'string',
  ComboBox: 'string',
  AutoBox: 'string',
  ComboBoxYear: 'string',
  BarcodeBox: 'string',
  CheckBox: 'string',
  DocLink: 'string',
}

const CustomFieldTemplate = props => {
  const {
    id,
    classNames: className,
    label,
    help,
    required,
    description,
    children,
    rawErrors,
    schema,
  } = props
  /* eslint-disable */
  return (
    <div className={`ant-form-item-control-wrapper ${className} ${styles.marginBottom0}`}>
      {!schema.inline &&
        (!schema.attributes || !schema.attributes.hideGroupLabel) &&
        (schema.attributes && schema.attributes.size === 'lg' ? (
          <>
            <h5>
              <strong>{label}</strong>
            </h5>
            <br />
          </>
        ) : (
          <label
            htmlFor={id}
            className={`${required ? 'ant-form-item-required' : ''} ${
              schema.type === 'object' ? styles.sectionHeader : ''
            }`}
          >
            {label}
          </label>
        ))}
      {description}
      {rawErrors && rawErrors.length > 0 && (
        <div className={`ant-form-explain ${styles.errorDescription}`}>{rawErrors[0]}</div>
      )}
      {children}
      {help}
    </div>
  )
  /* eslint-enable */
}

const ObjectFieldTemplate = props => {
  const { description, properties, schema } = props
  const { attributes } = schema
  return (
    <div
      className={classNames({
        [styles[`form-grid-container-${(attributes || {}).columns}`]]:
          attributes && attributes.columns,
      })}
    >
      {description}
      {properties.map((element, index) => (
        <div key={index} className="property-wrapper">
          {element.content}
        </div>
      ))}
    </div>
  )
}

export const generateSchema = (formInfo, initialNotes, initialValues, disabled, onAllowByPass) => {
  const parentUiSchema = {}
  const parentProperties = {}
  let flattenProperties = {}
  const formInfoKeys = Object.keys(formInfo)
  const formInfoIndex = formInfoKeys.findIndex(key => key === 'Others')
  if (formInfoIndex > -1) {
    formInfoKeys.splice(formInfoIndex, 1)
    formInfoKeys.push('Others')
  }

  for (let j = 0; j < formInfoKeys.length; j += 1) {
    const group = formInfoKeys[j]

    const uiSchema = {}
    const properties = {}
    const items = formInfo[group].properties ? formInfo[group].items : formInfo[group]
    for (let i = 0; i < items.length; i += 1) {
      const {
        key,
        type,
        label,
        validation,
        disabled: fieldDisabled,
        element,
        ...restProps
      } = items[i]
      const newKey = element ? `${element}.${key}` : key

      uiSchema[newKey] = { 'ui:widget': type }

      const defaultValue =
        (element === 'notes' && initialNotes && initialNotes[key]) ||
        ((initialValues && _.get(initialValues, newKey)) || undefined)

      properties[newKey] = {
        title: makeSentenceCase(label),
        key: newKey,
        type: types[type],
        control: type,
        isRequire: type !== 'CheckBox' && validation && validation.mandatory,
        allowByPass: validation && validation.allowByPass,
        group,
        disabled: disabled || fieldDisabled,
        initialNotes: initialNotes && initialNotes[key] && initialNotes[key].status,
        default: defaultValue,
        onAllowByPass,
        element,
        validation,
        ...restProps,
      }
    }

    const schema = { type: 'object', properties, attributes: formInfo[group].properties }

    parentProperties[group] = schema
    parentUiSchema[group] = uiSchema

    flattenProperties = { ...flattenProperties, ...properties }
  }

  const parentSchema = { type: 'object', properties: parentProperties }

  return { parentSchema, parentUiSchema, flattenProperties }
}

class ValidationMessagesWithFormActions extends React.Component {
  state = {
    additionalErrors: [],
    errorsList: [],
  }

  setAdditionalErrors(additionalErrors) {
    this.setState({ additionalErrors })
  }

  setErrorsList(errorsList) {
    this.setState({ errorsList })
  }

  render() {
    const { formActions, disabled, scrollTo, useSubmitEmbedded } = this.props
    const { errorsList, additionalErrors } = this.state
    const totalErrorsList = (additionalErrors || []).concat(errorsList)

    return (
      <>
        <div
          className={`has-error ${styles.marginTop30}`}
          data-test-selector="formbuilder-errorslist"
        >
          {totalErrorsList.length > 0 && (
            <WarningCard
              message="Validation issues"
              description={
                <div>
                  {totalErrorsList.map(error => (
                    <div
                      key={error.stack}
                      className={`form-validation-error-text ant-form-explain ${styles.marginTop4} ${styles.errorAnchor}`}
                      onClick={() => scrollTo(error.stack.split(':')[0])}
                      onKeyDown={() => {}}
                      role="button"
                      tabIndex="0"
                    >
                      {capitalize(error.stack)}
                    </div>
                  ))}
                </div>
              }
              type="create-form"
              show
              dataTestSelector="form-validation-card"
            />
          )}
        </div>
        {useSubmitEmbedded ? (
          <div className={styles.buttonGroup}>
            {formActions}
            <Button
              htmlType="submit"
              className={styles.btnSubmit}
              data-test-selector="form-submit"
              disabled={disabled || totalErrorsList.length}
            >
              Submit
            </Button>
          </div>
        ) : (
          formActions
        )}
      </>
    )
  }
}

class FormBuilder extends React.Component {
  state = {
    formData: {},
    liveValidate: false,
  }

  allowByPass = {}

  componentWillMount() {
    const { initialNotes } = this.props

    _.keys(initialNotes).forEach(key => {
      if (initialNotes[key] && initialNotes[key].status) {
        this.allowByPass[key] = initialNotes[key].status
      }
    })
  }

  onChange = schema => {
    const { onChange } = this.props
    const { formData } = schema
    this.setState({
      formData,
    })
    if (onChange) {
      onChange(formData)
    }
  }

  onAllowByPass = (key, reason) => {
    if (reason) {
      this.allowByPass[key] = reason
    } else {
      delete this.allowByPass[key]
    }
  }

  scrollTo = flattenId => {
    let id = 'root'
    const { formInfo } = this.props
    const formGroupNames = Object.keys(formInfo)
    formGroupNames.forEach(groupName => {
      const group = formInfo[groupName].items ? formInfo[groupName].items : formInfo[groupName]
      group.forEach(item => {
        if (item.key === flattenId) {
          id = `root_${groupName}_${flattenId}`
        }
      })
    })
    const formDrawerEle = document.querySelectorAll(`.form-drawer-content`)[0]
    const targetEle =
      document.querySelectorAll(`[for="${id}"]`)[0] || document.querySelectorAll(`[id="${id}"]`)[0]

    if (formDrawerEle && targetEle && typeof formDrawerEle.scrollTo === 'function') {
      formDrawerEle.scrollTo({
        top: targetEle.offsetTop - 10,
        left: 0,
        behavior: 'smooth',
      })
    }
  }

  scrollToBottom = () => {
    const formDrawerEle = document.querySelectorAll(`.form-drawer-content`)[0]
    if (formDrawerEle && typeof formDrawerEle.scrollTo === 'function') {
      formDrawerEle.scrollTo({
        top: formDrawerEle.scrollHeight,
        left: 0,
        behavior: 'smooth',
      })
    }
  }

  setAdditionalErrors = additionalErrors => {
    this.additionalErrors = additionalErrors
    this.validationMessages.setAdditionalErrors(additionalErrors)
  }

  render() {
    const {
      formInfo,
      onSubmit,
      initialValues,
      initialNotes,
      disabled,
      validate,
      children,
      formActions,
      useSubmitEmbedded,
    } = this.props

    const { formData: formDataState, liveValidate } = this.state
    if (!formInfo) return null

    const { parentSchema, parentUiSchema, flattenProperties } = generateSchema(
      formInfo,
      initialNotes,
      initialValues,
      disabled,
      this.onAllowByPass,
    )

    return (
      <Form
        data-test-selector="formbuilder_form"
        formData={formDataState}
        widgets={AntWidgets}
        schema={parentSchema}
        uiSchema={parentUiSchema}
        ErrorList={() => <div />}
        onSubmit={formData => onSubmit(formData, this.allowByPass)}
        liveValidate={liveValidate}
        validate={(formData, errors) => {
          const validationResult = validate
            ? validate(flattenToObject(formData), errors, flattenProperties, this.allowByPass)
            : errors
          const updatedErrorsList = flattenSchemaErrorsList(formInfo, validationResult)
          this.validationMessages.setErrorsList(updatedErrorsList)
          return validationResult
        }}
        onChange={this.onChange}
        FieldTemplate={CustomFieldTemplate}
        ObjectFieldTemplate={ObjectFieldTemplate}
        fields={{ TitleField: () => <div /> }}
        onError={errors => {
          this.setState({ liveValidate: true })
          setTimeout(() => {
            const totalErrorsList = (this.additionalErrors || []).concat(errors)
            if (totalErrorsList.length === 1) {
              this.scrollTo(totalErrorsList[0].stack.split(':')[0])
            } else {
              this.scrollToBottom()
            }
          }, 100)
        }}
      >
        {children}
        <ValidationMessagesWithFormActions
          ref={ref => {
            this.validationMessages = ref
          }}
          scrollTo={this.scrollTo}
          useSubmitEmbedded={useSubmitEmbedded}
          formActions={formActions}
          disabled={disabled}
        />
      </Form>
    )
  }
}

export default FormBuilder
