import React from 'react'
import RN, {View} from 'react-native'
import {BaseText} from '../styles'

export class TextInput extends React.PureComponent {
  render () {
    return <View>
      {this.props.label ? <BaseText>{this.props.label}</BaseText> : null}
      <RN.TextInput
        value={this.props.value}
        onChangeText={this.props.onChangeText}
      />
    </View>
  }
}
