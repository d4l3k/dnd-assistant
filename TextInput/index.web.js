import React from 'react'
import TextField from 'material-ui/TextField'

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
      value={this.props.value}
      onChange={this.onChangeText}
      margin="normal"
    />
  }
}
