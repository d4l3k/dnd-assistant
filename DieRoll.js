import React from 'react'
import autobind from 'autobind-decorator'
import {StyleSheet, View} from 'react-native'
import {BaseText, Secondary, colors} from './styles.js'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Roll from 'roll'

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
    if (this.props.pattern) {
      const roll = new Roll()
      this.setState(prev => {
        return {
          roll: roll.roll(this.props.pattern.trim()).result
        }
      })
      return
    }

    const roll = Math.floor(Math.random() * 20 + 1) + this.props.modifier
    this.setState(prev => {
      return {roll}
    })
  }
}

export class ExtractDieRolls extends React.PureComponent {
  render () {
    if (!this.props.text) {
      return
    }

    const rawPatterns = this.props.text.match(/\d+d\d+([+-]\d+)?/g) || []
    // deduplicate the patterns
    const patterns = Array.from(new Set(rawPatterns))
    return <View style={styles.rowwrap}>
      {patterns.map(this.renderPattern)}
    </View>
  }

  renderPattern (pattern, i) {
    return <View key={i} style={styles.row}>
      <BaseText>{i > 0 ? ', ' : ''}</BaseText>
      <DieRoll pattern={pattern} />
      <Secondary> ({pattern})</Secondary>
    </View>
  }
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  button: {
    marginRight: 0
  },
  rowwrap: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap'
  }
})
