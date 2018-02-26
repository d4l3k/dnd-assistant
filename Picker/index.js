import React from 'react'
import RN, {View} from 'react-native'
import {BaseText} from '../styles'

export class Picker extends React.PureComponent {
  render () {
    return <View>
      {this.props.label ? <BaseText>{this.props.label}</BaseText> : null}
      <RN.Picker
        selectedValue={this.props.selectedValue}
        onValueChange={this.props.onValueChange}>
        {this.props.children}
      </RN.Picker>
    </View>
  }
}

export const PickerItem = RN.Picker.Item
