import React from 'react'
import CopyAssetsForm from '../CopyAssetsForm'
import FormDrawerContainer from '../FormDrawerContainer'

class CopyAssetsDrawer extends React.Component {
  handleSubmit = copyAssets => {
    const { onCopy } = this.props
    onCopy(copyAssets)
  }

  render() {
    const { visible, onClose, items } = this.props
    return (
      <FormDrawerContainer onClose={onClose} drawerVisible={visible}>
        <div className="drawerHeader">Assets to be copied</div>
        <CopyAssetsForm handleSubmit={this.handleSubmit} items={items} onClose={onClose} />
      </FormDrawerContainer>
    )
  }
}

export default CopyAssetsDrawer
