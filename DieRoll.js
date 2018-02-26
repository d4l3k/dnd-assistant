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
    let displayRoll = this.state.roll
    if (this.props.mod && displayRoll > 0) {
      displayRoll = '+' + displayRoll
    }
    return <View style={styles.row}>
      <MaterialCommunityIcons.Button
        name='dice-multiple'
        color={colors.secondaryText}
        iconStyle={styles.button}
        backgroundColor='transparent'
        onPress={this.roll}
      />

      <BaseText>{displayRoll}</BaseText>
    </View>
  }

  computeRoll () {
    if (this.props.roll) {
      return this.props.roll(this.props)
    }
    if (this.props.pattern) {
      const roll = new Roll()
      return roll.roll(this.props.pattern.trim()).result
    }

    return Math.floor(Math.random() * parseFloat(this.props.d || 20) + 1) + parseFloat(this.props.modifier || 0)
  }

  @autobind
  roll () {
    const roll = this.computeRoll()
    this.setState(prev => {
      return {roll}
    })
  }
}

export const rollFate = ({modifier}) => {
  let roll = 0
  for (let i = 0; i < 4; i++) {
    roll += Math.floor(Math.random()*3-1)
  }
  return roll + parseFloat(modifier || 0)
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
