import CommonAssetForm from '../CommonAssetForm'

class EditVirtualAssetForm extends CommonAssetForm {
  render() {
    const {
      item,
      manufacturers,
      alias,
      onClose,
      mapToAddForm,
      children,
      isEditDisabled,
      disabled,
      ...restProps
    } = this.props

    const {
      assetDetail: { facets, lifecycle },
    } = this.props

    const { facet } = CommonAssetForm.resetFacet({
      facet: { ...facets },
      facetOverrides: {
        quantity: {
          type: 'EditQuantityBox',
        },
        condition: {
          disabled: isEditDisabled,
        },
        'install-date': {
          disabled: isEditDisabled,
        },
      },
    })

    super.options = {
      facet,
      initialValues: item,
      lifecycle,
      restProps,
      onClose,
      disabled,
    }
    return super.render()
  }
}

export default EditVirtualAssetForm
