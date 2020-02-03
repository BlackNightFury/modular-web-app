import React from 'react'
import FormDrawerContainer from '../FormDrawerContainer'
import EditAssetForm from '../EditAssetForm'
import CreateAssetForm from '../CreateAssetForm'
import EditRecordDrawer from '../EditRecordDrawer'
import { makeCopyAsset } from '@/services/asset'

class EditAssetDrawer extends React.Component {
  state = {
    isSaveCopy: false,
  }

  componentDidUpdate(prevProps) {
    const { visible } = this.props
    if (prevProps.visible !== visible) {
      this.setState({ isSaveCopy: false }) //eslint-disable-line
    }
  }

  mapToAddForm = () => {
    this.setState({ isSaveCopy: true })
  }

  render() {
    const {
      assetDetail,
      visible,
      onClose,
      item,
      tenant,
      onConfirm,
      onSaveCopy,
      disabled,
      onShowPSQ,
      readOnlyReason,
      isCopy,
      allAssets,
    } = this.props
    let { isSaveCopy } = this.state
    isSaveCopy = isSaveCopy || isCopy

    let newItem = { ...item }
    if (isSaveCopy) {
      newItem = makeCopyAsset(item, assetDetail.facets)
    }

    return isSaveCopy ? (
      <FormDrawerContainer onClose={onClose} drawerVisible={visible}>
        <CreateAssetForm
          formTitle="Add Asset from existing one"
          assetDetail={assetDetail}
          images={[]}
          item={newItem.facets}
          notes={newItem.notes}
          tenant={tenant}
          handleSubmit={onSaveCopy}
          onClose={onClose}
          disabled={disabled}
          allAssets={allAssets}
          saveCopied
        />
      </FormDrawerContainer>
    ) : (
      <EditRecordDrawer
        onClose={onClose}
        visible={visible}
        onShowPSQ={onShowPSQ}
        readOnly={disabled}
        readOnlyReason={readOnlyReason}
        testSelector="edit-asset-drawer"
        hideHeader
      >
        <EditAssetForm
          formTitle="Update asset"
          assetDetail={assetDetail}
          images={item.images}
          item={newItem.facets}
          notes={newItem.notes}
          tenant={tenant}
          handleSubmit={onConfirm}
          onClose={onClose}
          mapToAddForm={onSaveCopy ? this.mapToAddForm : null}
          disabled={disabled}
          allAssets={allAssets}
        />
      </EditRecordDrawer>
    )
  }
}

export default EditAssetDrawer
