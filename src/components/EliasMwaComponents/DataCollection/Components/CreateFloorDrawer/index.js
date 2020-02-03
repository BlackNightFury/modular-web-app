import React from 'react'
import CreateRecordDrawer from '../CreateRecordDrawer'
import FloorForm from '../FloorForm'

class CreateFloorDrawer extends React.PureComponent {
  render() {
    const { onClose, drawerVisible, handleSubmit } = this.props
    return (
      <CreateRecordDrawer onClose={onClose} drawerVisible={drawerVisible} header="Create floor">
        <FloorForm handleSubmit={handleSubmit} initialValue={{}} onClose={onClose} />
      </CreateRecordDrawer>
    )
  }
}

export default CreateFloorDrawer
