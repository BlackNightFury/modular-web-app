import React from 'react'
import { Checkbox, Input } from 'antd'

const { TextArea } = Input

class ReminderNote extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      noteVisible: !!props.initialValue,
      notes: props.initialValue ? props.initialValue : null,
    }
  }

  shouldComponentUpdate(nextProps) {
    const { initialValue } = this.props
    if (initialValue !== nextProps.initialValue) {
      this.setState({ notes: nextProps.initialValue, noteVisible: !!nextProps.initialValue })
    }
    return true
  }

  getNotes = () => {
    const { notes } = this.state

    return notes && notes.length === 0 ? null : notes
  }

  onSetNoteVisible = e => {
    const { notes } = this.state

    this.setState({ noteVisible: e.target.checked, notes: e.target.checked ? notes : null })
  }

  onNotesChanged = e => {
    this.setState({ notes: e.target.value })
  }

  render() {
    const { noteVisible, notes } = this.state

    return (
      <div>
        <Checkbox
          onChange={this.onSetNoteVisible}
          checked={noteVisible}
          data-test-selector="reminder_checkbox"
        >
          Add a reminder
        </Checkbox>
        {noteVisible && (
          <TextArea
            rows={4}
            onChange={this.onNotesChanged}
            value={notes}
            data-test-selector="reminder_notes"
          />
        )}
      </div>
    )
  }
}

export default ReminderNote
