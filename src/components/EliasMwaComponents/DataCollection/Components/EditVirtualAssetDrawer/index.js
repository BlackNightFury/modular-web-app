import React from 'react'
import EditVirtualAssetForm from '../EditVirtualAssetForm'
import EditRecordDrawer from '../EditRecordDrawer'

class EditVirtualAssetDrawer extends React.Component {
  render() {
    const {
      assetDetail,
      visible,
      onClose,
      item,
      tenant,
      onConfirm,
      isEditDisabled,
      disabled,
      onShowPSQ,
      readOnlyReason,
    } = this.props

    return (
      <EditRecordDrawer
        onClose={onClose}
        visible={visible}
        onShowPSQ={onShowPSQ}
        readOnly={disabled}
        readOnlyReason={readOnlyReason}
        testSelector="edit-virtualasset-drawer"
        hideHeader
      >
        <EditVirtualAssetForm
          formTitle="Edit virtual asset"
          assetDetail={assetDetail}
          images={item.images}
          item={item.facets}
          notes={item.notes}
          tenant={tenant}
          handleSubmit={onConfirm}
          onClose={onClose}
          isEditDisabled={isEditDisabled}
          disabled={disabled}
        />
      </EditRecordDrawer>
    )
  }
}

export default EditVirtualAssetDrawer
