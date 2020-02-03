import React from 'react'
import EditRecordDrawer from '../EditRecordDrawer'
import FacilityForm from '../FacilityForm'

class EditFacilityDrawer extends React.Component {
  handleSubmit = values => {
    const { onUpdate } = this.props
    onUpdate(values)
  }

  render() {
    const { onClose, visible, readOnly, onShowPSQ, readOnlyReason, facility } = this.props
    return (
      <EditRecordDrawer
        onClose={onClose}
        visible={visible}
        onShowPSQ={onShowPSQ}
        readOnly={readOnly}
        readOnlyReason={readOnlyReason}
        testSelector="edit-facility-drawer"
        header="Update facility"
      >
        {visible && (
          <FacilityForm
            initialValue={facility}
            readOnly={readOnly}
            onClose={onClose}
            handleSubmit={this.handleSubmit}
          />
        )}
      </EditRecordDrawer>
    )
  }
}

export default EditFacilityDrawer
