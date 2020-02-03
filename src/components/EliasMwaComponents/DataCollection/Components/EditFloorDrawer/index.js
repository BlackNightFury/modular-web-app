import React from 'react'
import FloorForm from '../FloorForm'
import EditRecordDrawer from '../EditRecordDrawer'

class EditFloorDrawer extends React.Component {
  handleSubmit = values => {
    const { onConfirm, item } = this.props
    onConfirm({ ...item, ...values })
  }

  render() {
    const { visible, onClose, item, readOnly, onShowPSQ, readOnlyReason } = this.props
    return (
      <EditRecordDrawer
        onClose={onClose}
        visible={visible}
        onShowPSQ={onShowPSQ}
        readOnly={readOnly}
        readOnlyReason={readOnlyReason}
        testSelector="edit-floor-drawer"
        header="Update floor"
      >
        <FloorForm
          handleSubmit={this.handleSubmit}
          initialValue={item}
          submitBtnLabel="Update"
          onClose={onClose}
          readOnly={readOnly}
        />
      </EditRecordDrawer>
    )
  }
}

export default EditFloorDrawer
