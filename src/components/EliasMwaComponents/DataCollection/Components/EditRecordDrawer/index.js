import React, { Component } from 'react'
import FormDrawerContainer from '../FormDrawerContainer'
import ReadonlyWarningCard from '../ReadonlyWarningCard'

class Antd extends Component {
  onShowPSQ = () => {
    const { onShowPSQ, onClose } = this.props
    onClose()
    onShowPSQ()
  }

  render() {
    const {
      onClose,
      visible,
      testSelector,
      readOnly,
      children,
      header,
      hideHeader,
      readOnlyReason,
    } = this.props
    return (
      <FormDrawerContainer onClose={onClose} drawerVisible={visible} testSelector={testSelector}>
        {!hideHeader && <div className="drawerHeader">{header}</div>}
        <ReadonlyWarningCard
          readOnly={readOnly}
          readOnlyReason={readOnlyReason}
          onShowPSQ={this.onShowPSQ}
        />
        {children}
      </FormDrawerContainer>
    )
  }
}

export default Antd
