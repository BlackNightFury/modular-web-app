import CommonAssetForm from '../CommonAssetForm'

class CreateAssetForm extends CommonAssetForm {
  quantityDisabledCallback = obj => obj.allowMultiple === undefined || !obj.allowMultiple

  render() {
    const {
      item,
      manufacturers,
      alias,
      onClose,
      children,
      saveCopied,
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
      saveCopied,
    })

    super.options = {
      facet,
      initialValues,
      lifecycle,
      allAssets,
      restProps,
      onClose,
    }
    return super.render()
  }
}

export default CreateAssetForm
