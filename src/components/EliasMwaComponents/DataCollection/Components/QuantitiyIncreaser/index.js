import React from 'react'
import { Input, Button } from 'antd'
import styles from './style.scss'

class QuantityIncreaser extends React.Component {
  state = {
    deltaValue: null,
  }

  onChange = e => {
    this.setState({ deltaValue: e.target.value })
  }

  onUpdate = e => {
    const { deltaValue } = this.state
    const { value, onChange } = this.props
    e.stopPropagation()

    if (onChange) {
      onChange(parseInt(value || 0, 10) + parseInt(deltaValue || 1, 10))
    }
    this.setState({ deltaValue: null })
  }

  render() {
    const { value, id, hideLabel, disabled } = this.props
    const { deltaValue } = this.state
    return (
      <span id={id}>
        {!hideLabel ? `${value} ` : null}
        <Input
          className={styles.input}
          data-test-selector="quantityincreaser_input"
          type="number"
          value={deltaValue}
          onClick={e => {
            e.stopPropagation()
          }}
          onChange={this.onChange}
          disabled={disabled}
          autoComplete="off"
        />
        <Button
          data-test-selector="quantityincreaser_button"
          onClick={this.onUpdate}
          disabled={disabled}
        >
          +
        </Button>
      </span>
    )
  }
}

export default QuantityIncreaser
