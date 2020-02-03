import React from 'react'
import router from 'umi/router'

class Link extends React.Component {
  onClick = () => {
    const { to } = this.props
    router.push(to)
  }

  render() {
    const { children } = this.props
    return <button type="button" onClick={this.onClick}>{children}</button>
  }
}

export default Link
