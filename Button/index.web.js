import React from 'react'
import Btn from '@mui/material/Button'

export class Button extends React.PureComponent {
  constructor (props) {
    super(props)

    this._onPress = (e) => {
      e.stopPropagation()

      this.props.onPress(e)
    }
  }

  render () {
    return <Btn onClick={this._onPress} color="primary" variant='raised' style={{
      backgroundColor: this.props.color
    }}>
      {this.props.title}
    </Btn>
  }
}


