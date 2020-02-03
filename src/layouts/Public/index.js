import React from 'react'

export default class PublicLayout extends React.PureComponent {
  render() {
    const { children } = this.props
    return children
  }
}
