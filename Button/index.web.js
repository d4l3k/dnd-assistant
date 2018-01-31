import React from 'react'
import Btn from 'material-ui/Button'

export class Button extends React.PureComponent {
  constructor (props) {
    super(props)

    this._onPress = (e) => {
      e.stopPropagation()

      this.props.onPress(e)
    }
  }

  render () {
    return <Btn onClick={this._onPress} color="primary" raised={true}>
      {this.props.title}
    </Btn>
  }
}


