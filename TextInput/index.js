import React from 'react'
import RN, {View, StyleSheet} from 'react-native'
import {BaseText, Secondary} from '../styles'

export class TextInput extends React.PureComponent {
  render () {
    return <View style={[this.props.flex ? styles.input : undefined]}>
      {this.props.label ? <Secondary>{this.props.label}</Secondary> : null}
      <RN.TextInput
        value={this.props.value}
        multiline={this.props.multiline}
        onChangeText={this.props.onChangeText}
        keyboardType={this.props.keyboardType}
      />
    </View>
  }
}

const styles = StyleSheet.create({
  input: {
    flex: 1
  }
})
