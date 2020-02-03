import React from 'react'
import { Button } from 'antd'
import CommonAssetForm from '../CommonAssetForm'

class EditAssetForm extends CommonAssetForm {
  quantityDisabledCallback = obj => obj.allowMultiple === undefined || !obj.allowMultiple

  render() {
    const {
      item,
      manufacturers,
      alias,
      onClose,
      mapToAddForm,
      children,
      disabled,
      allAssets,
      ...restProps
    } = this.props

    const {
      assetDetail: { facets, lifecycle },
    } = this.props

    const { facet, initialValues } = CommonAssetForm.resetFacet({
      facet: { ...facets },
      facetOverrides: {
        quantity: {
          type: 'QuantityBox',
          disabled: this.quantityDisabledCallback,
        },
      },
      initialValues: item,
      initialValueOverrides: {
        quantity: 1,
      },
    })

    const secondaryActionButton = mapToAddForm && (
      <Button disabled={disabled} onClick={mapToAddForm}>
        Save and copy
      </Button>
    )

    const filteredAssets = allAssets.filter(asset => asset.facets.barcode !== item.barcode)

    super.options = {
      facet,
      initialValues,
      lifecycle,
      restProps,
      onClose,
      disabled,
      secondaryActionButton,
      allAssets: filteredAssets,
    }
    return super.render()
  }
}

export default EditAssetForm
