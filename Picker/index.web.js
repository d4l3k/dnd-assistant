import React from 'react'
import autobind from 'autobind-decorator'
import { MenuItem } from 'material-ui/Menu'
import { InputLabel } from 'material-ui/Input'
import { FormControl, FormHelperText } from 'material-ui/Form'
import Select from 'material-ui/Select'

let nextPickerID = 1

export class Picker extends React.PureComponent {
  constructor (props) {
    super(props)

    this.inputProps = {id: 'picker'+nextPickerID}
    nextPickerID += 1
  }

  render () {
    return <FormControl>
      <InputLabel htmlFor={this.inputProps.id}>{this.props.label}</InputLabel>
      <Select
        value={this.props.selectedValue}
        onChange={this.onChange}
        inputProps={this.inputProps}
        renderValue={this.renderValue}
      >
        {this.props.children}
      </Select>
    </FormControl>
  }

  @autobind
  renderValue (value) {
    let display
    React.Children.forEach(this.props.children, child => {
      if (child.props.value == value) {
        display = child.props.label
      }
    })
    return display
  }

  @autobind
  onChange (e) {
    if (!this.props.onValueChange) {
      return
    }

    this.props.onValueChange(e.target.value)
  }
}

export class PickerItem extends React.PureComponent {
  render () {
    const {label, ...other} = this.props
    return <MenuItem {...other}>{label}</MenuItem>
  }
}

