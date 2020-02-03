import React from 'react'
import FormDrawerContainer from '../FormDrawerContainer'

class Antd extends React.PureComponent {
  render() {
    const { onClose, drawerVisible, children, header, hideHeader } = this.props
    return (
      <FormDrawerContainer onClose={onClose} drawerVisible={drawerVisible}>
        {!hideHeader && <div className="drawerHeader">{header}</div>}
        {children}
      </FormDrawerContainer>
    )
  }
}

export default Antd
