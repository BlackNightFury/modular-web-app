import CommonAssetForm from '../CommonAssetForm'

class CreateVirtualAssetForm extends CommonAssetForm {
  render() {
    const { item, manufacturers, alias, onClose, children, saveCopied, ...restProps } = this.props

    const {
      assetDetail: { facets, lifecycle },
    } = this.props

    const { facet } = CommonAssetForm.resetFacet({
      facet: { ...facets },
      facetOverrides: {
        quantity: {
          type: 'QuantityBox',
        },
      },
    })

    super.options = {
      facet,
      lifecycle,
      restProps,
      onClose,
    }
    return super.render()
  }
}

export default CreateVirtualAssetForm
