import React from 'react'
import CB from 'material-ui/Checkbox'

export class CheckBox extends React.Component {
  constructor (props) {
    super(props)

    this.onClick = (e) => {
      this.props.onClick(e)
    }
  }

  shouldComponentUpdate (props, state) {
    return this.props.isChecked !== props.isChecked
  }

  render () {
    return <CB
      checked={this.props.isChecked || false}
      onChange={this.onClick}
    />
  }
}
