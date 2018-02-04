import React from 'react'
import autobind from 'autobind-decorator'
import {StyleSheet, View} from 'react-native'
import {BaseText, colors} from './styles.js'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

export class DieRoll extends React.PureComponent {
  constructor (props) {
    super(props)

    this.state = {
      roll: ''
    }
  }

  render () {
    return <View style={styles.row}>
      <MaterialCommunityIcons.Button
        name='dice-multiple'
        color={colors.secondaryText}
        iconStyle={styles.button}
        backgroundColor='transparent'
        onPress={this.roll}
      />

      <BaseText>{this.state.roll}</BaseText>
    </View>
  }

  @autobind
  roll () {
    const roll = Math.floor(Math.random() * 20 + 1) + this.props.modifier
    this.setState(prev => {
      return {roll}
    })
  }
}


const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  button: {
    marginRight: 0
  }
})
