import moment from 'moment'
import { getLocalDateTimeFormat } from './datetime'

export const checkCondition = (condition, installDate, lifeCycle) => {
  if (lifeCycle) {
    return (
      condition >= 'C' || moment().year() - moment(new Date(installDate)).year() > lifeCycle - 5
    )
  }

  return condition >= 'C'
}

export const getInstallDateFormat = () => {
  const fullDateFormat = getLocalDateTimeFormat('L')
  const fullDateFormatWithoutDD = fullDateFormat.replace(/(DD-)|(DD\/)|(-DD)|(\/DD)/, '')
  return [fullDateFormat, fullDateFormatWithoutDD, 'YYYY']
}

const checkInstallDateValidation = value => {
  const aDate = moment(value, getInstallDateFormat(), true)
  const thisyear = new Date().getFullYear()

  if (!aDate.isValid() || aDate.year() < 1900 || aDate.year() > thisyear) {
    return ['Invalid Date']
  }

  return []
}

const checkBuildDateValidation = value => {
  const aDate = moment(value, getInstallDateFormat(), true)
  const thisyear = new Date().getFullYear()

  if (!aDate.isValid() || aDate.year() > thisyear) {
    return ['Invalid Date']
  }

  return []
}

const checkQuantityValidation = value => {
  const quantity = parseInt(value, 10)

  if (Number.isNaN(quantity) || quantity < 0) {
    return ['Invalid Quantity']
  }

  return []
}

const checkDuplicateBarcodeValidation = (value, allAssets) => {
  const filteredAssets = allAssets.filter(asset => asset.facets.barcode === value)
  if (filteredAssets.length) {
    return ['Duplicated Barcode']
  }
  return []
}

const checkValidation = (type, label, key, value, required, validation, allAssets) => {
  let errors = []
  if (required && !value) {
    errors.push(`Please input the ${label}!`)
  }

  if (key === 'install-date') {
    errors = errors.concat(checkInstallDateValidation(value))
  }

  if (key === 'facets["build-date"]') {
    errors = errors.concat(checkBuildDateValidation(value))
  }
  if (key === 'quantity') {
    errors = errors.concat(checkQuantityValidation(value))
  }
  if (validation) {
    if (validation.isRegEx) {
      const regExp = new RegExp(validation.value.split('#')[0])
      if (!regExp.test(value)) {
        errors = errors.concat([validation.errorMessage || validation.value.split('#')[1]])
      } else if (key === 'barcode') {
        errors = errors.concat(checkDuplicateBarcodeValidation(value, allAssets))
      }
    } else {
      // Apply non-RegEx validation data
    }
  }
  return errors
}

export default checkValidation

export const assetValidation = (
  formData,
  errors,
  properties,
  allowByPass,
  lifecycle,
  allAssets,
) => {
  Object.keys(formData).forEach(key => {
    if (allowByPass[key]) {
      return
    }

    const { group } = properties[key]
    const errMsg = checkValidation(
      properties[key].control,
      properties[key].title,
      key,
      formData[key],
      properties[key].isRequire,
      properties[key].validation,
      allAssets,
    )

    if (key === 'notes.condition') {
      if (!formData[key] && checkCondition(formData.condition, formData.InstallDate, lifecycle)) {
        errors[group][key].addError(`Please input the ${properties[key].label}`)
      }
    } else if (errMsg.length > 0) {
      errors[group][key].addError(errMsg[0])
    }
  })
  return errors
}

export const commonFormValidation = (formData, errors, properties) => {
  Object.keys(formData).forEach(key => {
    const { group } = properties[key]
    const errMsg = checkValidation(
      properties[key].control,
      properties[key].title,
      key,
      formData[key],
      properties[key].isRequire,
      properties[key].validation,
    )

    if (errMsg.length > 0) {
      errors[group][key].addError(errMsg[0])
    }
  })

  return errors
}
