import React from 'react'
import autobind from 'autobind-decorator'
import MenuItem from '@mui/material/MenuItem'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import Select from '@mui/material/Select'

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

