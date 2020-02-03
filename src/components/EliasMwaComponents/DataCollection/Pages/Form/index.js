import React from 'react'
import FormBuilder from '@/components/EliasMwaComponents/Forms/Components/FormBuilder'
import NotFound from '@/pages/404'
import { getFormInitialValues } from '@/services/form-builder'
import Home from '../Home'
import FormDrawerContainer from '../../Components/FormDrawerContainer'
import checkValidation from '@/services/asset-validation'

class Antd extends React.Component {
  onCloseFormDrawer = () => {
    const {
      history,
      history: {
        location: { pathname },
      },
    } = this.props
    history.push(
      `${
        pathname.startsWith('/clickable-prototype') ? '/clickable-prototype' : ''
      }/data-collection/home`,
    )
  }

  formValidate = (formData, errors, properties) => {
    Object.keys(formData).forEach(key => {
      const { group } = properties[key]
      const errMsg = checkValidation(
        properties[key].control,
        properties[key].title,
        key,
        formData[key],
        properties[key].isRequire,
      )

      if (errMsg.length > 0) {
        errors[group][key].addError(errMsg[0])
      }
    })
    return errors
  }

  onSubmitForm = values => {
    const {
      match: {
        params: { formId },
      },
      onAdd,
    } = this.props
    onAdd({
      formId,
      response: JSON.stringify(values),
    })
    this.onCloseFormDrawer()
  }

  render() {
    const {
      match: {
        params: { formId },
      },
      history: {
        location: { query },
      },
    } = this.props
    const { forms } = window.mwa_config
    const form = forms[formId]
    const isAccessible = form && form.allowRoute
    const initialValues = isAccessible ? getFormInitialValues(form, true, query) : {}
    if (!isAccessible) {
      return <NotFound />
    }

    return (
      <>
        <Home {...this.props} />
        {isAccessible && (
          <FormDrawerContainer title={form.header} onClose={this.onCloseFormDrawer} drawerVisible>
            <FormBuilder
              form={form}
              initialValues={initialValues}
              onClose={this.onCloseFormDrawer}
              validate={this.formValidate}
              onSubmit={this.onSubmitForm}
              hideSave
            />
          </FormDrawerContainer>
        )}
      </>
    )
  }
}

export default Antd
