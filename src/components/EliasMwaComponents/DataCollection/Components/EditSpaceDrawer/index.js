import React from 'react'
import SpaceForm from '../SpaceForm'
import { removeEmptyValues } from '@/services/utils'
import EditRecordDrawer from '../EditRecordDrawer'

class EditSpaceDrawer extends React.Component {
  handleSubmit = values => {
    const { onConfirm, item } = this.props
    let newValues = { ...item, ...values }
    if (newValues.status !== 'INACCESSIBLE') {
      delete newValues.availableDate
    }
    newValues = removeEmptyValues(newValues)
    onConfirm(newValues)
  }

  render() {
    const {
      visible,
      onClose,
      item,
      spaceTypes,
      readOnly,
      onShowPSQ,
      readOnlyReason,
      projectId,
    } = this.props
    return (
      <EditRecordDrawer
        onClose={onClose}
        visible={visible}
        onShowPSQ={onShowPSQ}
        readOnly={readOnly}
        readOnlyReason={readOnlyReason}
        testSelector="edit-space-drawer"
        header="Update space"
      >
        <SpaceForm
          handleSubmit={this.handleSubmit}
          initialValue={item}
          submitBtnLabel="Update"
          spaceTypes={spaceTypes}
          onClose={onClose}
          readOnly={readOnly}
          projectId={projectId}
        />
      </EditRecordDrawer>
    )
  }
}

export default EditSpaceDrawer
