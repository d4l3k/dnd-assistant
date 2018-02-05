import React from 'react'
import RN, {View, StyleSheet} from 'react-native'
import {BaseText} from '../styles'

export class TextInput extends React.PureComponent {
  render () {
    return <View style={styles.input}>
      {this.props.label ? <BaseText>{this.props.label}</BaseText> : null}
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
