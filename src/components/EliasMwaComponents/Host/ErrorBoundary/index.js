import React from 'react'
import styles from './style.scss'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  componentDidUpdate(prevProps) {
    const { pathname } = this.props
    if (prevProps.pathname !== pathname) {
      this.setState({ hasError: false }) //eslint-disable-line
    }
  }

  componentDidCatch(error) {
    this.setState({ hasError: true })

    if (window.newrelic) window.newrelic.noticeError(error)
  }

  render() {
    const { hasError } = this.state
    const { children } = this.props

    if (hasError) {
      // You can render any custom fallback UI
      return <h3 className={styles.errorText}>Sorry! Something went wrong</h3>
    }

    return children
  }
}

export default ErrorBoundary
