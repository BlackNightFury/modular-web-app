import React from 'react'
import { Prompt } from 'react-router-dom'
import UncopiedAssetWarningModal from '@/components/EliasMwaComponents/DataCollection/Components/UncopiedAssetWarningModal'

export class RouteLeavingGuard extends React.Component {
  state = {
    modalVisible: false,
    lastLocation: null,
    confirmedNavigation: false,
  }

  showModal = location => {
    this.setState({ modalVisible: true })
    this.setState({ lastLocation: location })
  }

  closeModal = cb => {
    this.setState({ modalVisible: false })
    if (cb) {
      cb()
    }
  }

  handleBlockedNavigation = nextLocation => {
    const { confirmedNavigation } = this.state
    const { shouldBlockNavigation } = this.props
    if (!confirmedNavigation && shouldBlockNavigation(nextLocation)) {
      this.showModal(nextLocation)
      return false
    }
    return true
  }

  handleConfirmNavigationClick = () => {
    const { lastLocation } = this.state
    this.closeModal(() => {
      if (lastLocation) {
        this.setState({ confirmedNavigation: true })
      }
    })
  }

  handleCancelClick = () => {
    this.closeModal(() => {})
  }

  render() {
    const { when, navigate, totalAssets, spaceName } = this.props
    const { modalVisible, confirmedNavigation, lastLocation } = this.state
    if (confirmedNavigation) {
      navigate(lastLocation.pathname)
    }
    return (
      <div>
        <Prompt when={when} message={this.handleBlockedNavigation} />
        <UncopiedAssetWarningModal
          visible={modalVisible}
          totalAssets={totalAssets}
          spaceName={spaceName}
          onConfirm={this.handleConfirmNavigationClick}
          onCancel={this.handleCancelClick}
        />
      </div>
    )
  }
}

export default RouteLeavingGuard
