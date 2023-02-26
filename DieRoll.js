import React from 'react'
import autobind from 'autobind-decorator'
import {StyleSheet, View, Text} from 'react-native'
import {BaseText, Secondary, colors} from './styles.js'
import {Hover} from './Hover'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Roll from 'roll'

export class DieRoll extends React.PureComponent {
  constructor (props) {
    super(props)

    this.state = {
      roll: ''
    }
  }

  pattern () {
    if (this.props.roll) {
      return ''
    }
    if (this.props.pattern) {
      return this.props.pattern.trim()
    }
    let out = '1d'+this.maxBase()
    if (this.props.modifier) {
      out += '+' + this.props.modifier
    }
    return out
  }

  render () {
    let displayRoll = this.state.roll
    if (this.props.mod && displayRoll > 0) {
      displayRoll = '+' + displayRoll
    }

    const style = {}
    if (this.state.base == 1) {
      style.color = colors.error
    } else if (this.state.base == this.maxBase()) {
      style.color = colors.primary
    }

    return <View style={styles.row}>
      <Hover title={this.pattern()}>
        <MaterialCommunityIcons.Button
          name='dice-multiple'
          color={colors.secondaryText}
          iconStyle={styles.button}
          backgroundColor='transparent'
          onPress={this.roll}
        />

        <BaseText>
          <Text style={style}>
          {displayRoll}
          </Text>
        </BaseText>
      </Hover>
    </View>
  }

  maxBase () {
    return parseFloat(this.props.d || 20)
  }

  computeRoll () {
    if (this.props.roll) {
      return {
        roll: this.props.roll(this.props),
      }
    }
    if (this.props.pattern) {
      const roll = new Roll().roll(this.props.pattern.trim())
      return {
        base: roll.rolled,
        roll: roll.result,
      }
    }

    const base = Math.floor(Math.random() * this.maxBase() + 1)
    const roll = base + parseFloat(this.props.modifier || 0)

    return {base, roll}
  }

  @autobind
  roll () {
    const roll = this.computeRoll()
    this.setState(roll)
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
