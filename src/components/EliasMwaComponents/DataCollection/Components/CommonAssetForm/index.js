import React from 'react'
import _ from 'lodash'
import { Button } from 'antd'
import AssetFormBuilder from '../AssetFormBuilder'
import styles from './style.scss'
import { assetValidation } from '@/services/asset-validation'

class CommonAssetForm extends React.Component {
  static resetFacet(resetOptions) {
    const { facetOverrides, initialValues, initialValueOverrides, saveCopied } = resetOptions
    const facet = _.groupBy(resetOptions.facet, 'group')
    const keys = Object.keys(facet)

    keys.forEach(key => {
      facet[key] = facet[key].map(obj => {
        const newObj = { ...obj }
        if (saveCopied && !newObj.copy) {
          initialValues[newObj.key] = ''
        }
        if (_.has(facetOverrides, obj.key)) {
          const { type, disabled } = facetOverrides[obj.key]
          newObj.type = type === undefined ? newObj.type : type
          if (typeof disabled === 'function') {
            newObj.disabled = disabled(newObj)
          } else {
            newObj.disabled = disabled
          }
        }

        if (_.has(initialValueOverrides, obj.key)) {
          initialValues[obj.key] = initialValueOverrides[obj.key]
        }
        return newObj
      })
    })

    return { facet, initialValues }
  }

  render() {
    const {
      facet,
      initialValues,
      lifecycle,
      restProps,
      onClose,
      disabled,
      secondaryActionButton,
      allAssets,
    } = this.options

    const formActions = (
      <>
        <Button
          className={styles.btnCancel}
          onClick={onClose}
          data-test-selector="asset-form-cancel"
        >
          Cancel
        </Button>
        {secondaryActionButton}
      </>
    )

    return (
      <AssetFormBuilder
        schema={facet}
        item={initialValues}
        disabled={disabled}
        validate={(formData, errors, properties, allowByPass) =>
          assetValidation(formData, errors, properties, allowByPass, lifecycle, allAssets)
        }
        {...restProps}
        formActions={formActions}
      />
    )
  }
}

export default CommonAssetForm
