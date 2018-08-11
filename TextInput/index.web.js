import React from 'react'
import TextField from '@material-ui/core/TextField'
import autobind from 'autobind-decorator'

export class TextInput extends React.Component {
  constructor (props) {
    super(props)

    this.onChangeText = (e) => {
      this.props.onChangeText(e.target.value)
    }
  }

  shouldComponentUpdate (nextProps, nextState) {
    return nextProps.value !== this.props.value
  }

  render () {
    return <TextField
      label={this.props.label}
      value={this.props.value}
      multiline={this.props.multiline}
      onChange={this.onChangeText}
      fullWidth={true}
      margin="normal"
      autoFocus={this.props.autoFocus}
      type={this.props.keyboardType === 'numeric' ? 'number' : 'text'}
    />
  }
}
