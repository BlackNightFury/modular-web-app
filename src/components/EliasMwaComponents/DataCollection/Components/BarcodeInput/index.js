import React from 'react'
import { Modal, Input, Button } from 'antd'
import styles from './style.scss'

class BarcodeInput extends React.Component {
  state = {}

  onChange = e => {
    const { onChange } = this.props
    onChange(e.target.value)
  }

  updateFromLastBarcode = e => {
    const {
      onChange,
      schema: { lastBarcode },
    } = this.props
    e.stopPropagation()

    if (onChange) {
      if (lastBarcode) {
        // Below code is rule for getting next bar code from current barcode
        // assuming length of bar code is static and prefix 0 is allowed
        // sample calculation rule process for 0 prefix is like below
        // assume last bar code is 0000223
        // next bar code is slice(1) of (10000223 + 1 = 10000224) is 0000224
        // it's using javascript slice and number calculation function
        onChange((parseInt(`1${lastBarcode}`, 10) + 1).toString().slice(1))
      } else {
        Modal.error({
          title: 'No last barcode',
          content: `Last barcode is unavailable.`,
        })
      }
    }
  }

  render() {
    const { value, id, disabled, schema } = this.props
    return (
      <span id={id}>
        <Input
          id={id}
          type="text"
          className={`${styles.fontSize13} ${styles.marginBottom10} ${styles.input}`}
          data-test-selector="barcode_input"
          value={value ? String(value) : value}
          onChange={this.onChange}
          disabled={schema.disabled}
          autoComplete="off"
        />
        <Button
          data-test-selector="barcodeincreaser_button"
          onClick={this.updateFromLastBarcode}
          disabled={disabled}
        >
          +
        </Button>
      </span>
    )
  }
}

export default BarcodeInput
