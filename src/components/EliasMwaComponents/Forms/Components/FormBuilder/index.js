import React from 'react'
import _ from 'lodash'
import classNames from 'classnames'
import { Button } from 'antd'
import { flattenToObject } from '@/services/utils'
import Form from '@/components/EliasMwaComponents/DataCollection/Components/Form'

import styles from './style.scss'

class FormBuilder extends React.Component {
  onSubmit = value => {
    const { form, onSubmit } = this.props
    const { formData } = value
    onSubmit({
      ...flattenToObject(formData),
      ..._.reduce(
        form.fieldsets || [],
        (result, fieldSet) => ({
          ...result,
          ..._.filter(fieldSet.questions || [], question => !question.visible).reduce(
            (prev, cur) => ({
              ...prev,
              [cur.fieldName]: cur.defaultValue,
            }),
            {},
          ),
        }),
        {},
      ),
    })
  }

  render() {
    const {
      form,
      initialValues,
      onClose,
      onSave,
      validate,
      submitBtnText,
      onChange,
      submitDisabled,
      hideCancel,
      hideSave,
      disabled,
      hasUnsyncWarning,
      warningCard,
      submitTestSelector,
      saveTestSelector,
    } = this.props

    const newFacet = _.reduce(
      form.fieldsets || [],
      (result, fieldSet) => {
        const items = _.filter(fieldSet.questions || [], question => question.visible).map(
          (question, index) => ({
            group: fieldSet.name,
            key: question.fieldName,
            value: question.fieldName,
            validation: {
              mandatory: question.required,
            },
            order: index,
            type: question.type,
            label: question.description,
            name: question.description,
            text: question.description,
            inline: question.inline,
            element: question.element,
            enum: question.enum ? question.enum : undefined,
          }),
        )
        if (fieldSet.properties) {
          result[fieldSet.name] = {
            items,
            properties: fieldSet.properties,
          }

          return result
        }
        result[fieldSet.name] = items
        return result
      },
      {},
    )

    const formActions = (
      <div className={classNames(styles.actionContainer, { [styles.noCancel]: hideCancel })}>
        {!hideCancel && (
          <Button data-test-selector="form-cancel" className={styles.cancelBtn} onClick={onClose}>
            Cancel
          </Button>
        )}
        <div>
          {!hideSave && (
            <Button
              data-test-selector={saveTestSelector || 'form-save'}
              className={classNames('tertiary-btn', styles.marginRight10)}
              onClick={onSave}
            >
              Save
            </Button>
          )}

          <Button
            data-test-selector={submitTestSelector || 'form-submit'}
            disabled={submitDisabled}
            className="primary-outline-btn"
            htmlType="submit"
          >
            {submitBtnText || 'Submit'}
          </Button>
        </div>
      </div>
    )

    return (
      <>
        <div>{form.description}</div>
        <Form
          formInfo={newFacet}
          initialValues={initialValues}
          onSubmit={this.onSubmit}
          validate={validate}
          onChange={onChange}
          disabled={disabled}
          formActions={formActions}
          ref={ref => {
            this.formRef = ref
          }}
        >
          {hasUnsyncWarning && warningCard}
        </Form>
      </>
    )
  }
}

export default FormBuilder
