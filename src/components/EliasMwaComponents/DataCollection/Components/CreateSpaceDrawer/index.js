import React from 'react'
import { withRouter } from 'dva/router'
import CreateRecordDrawer from '../CreateRecordDrawer'
import SpaceForm from '../SpaceForm'

@withRouter
class CreateSpaceDrawer extends React.PureComponent {
  render() {
    const {
      onClose,
      drawerVisible,
      handleSubmit,
      spaceTypes,
      projectId,
      projectName,
      floorName,
      facilityName,
      history,
    } = this.props
    return (
      <CreateRecordDrawer onClose={onClose} drawerVisible={drawerVisible} header="Create space">
        <SpaceForm
          handleSubmit={handleSubmit}
          spaceTypes={spaceTypes}
          initialValue={{}}
          onClose={onClose}
          projectId={projectId}
          projectName={projectName}
          floorName={floorName}
          facilityName={facilityName}
          history={history}
        />
      </CreateRecordDrawer>
    )
  }
}

export default CreateSpaceDrawer
