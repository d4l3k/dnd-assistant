import React from 'react'
import autobind from 'autobind-decorator'
import {Text, StyleSheet, View, ScrollView} from 'react-native'
import { createIconSet } from 'react-native-vector-icons';
import {colors, H2, Touchable, BaseText, B} from '../styles.js'
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons'

import './fonts'

const glyphMap = {
  boostDie: 'b',
  setbackDie: 'b',
  abilityDie: 'd',
  difficultyDie: 'd',
  proficiencyDie: 'c',
  challengeDie: 'c',
  forceDie: 'c',
  success: 's',
  failure: 'f',
  advantage: 'a',
  threat: 't',
  triumph: 'x',
  despair: 'y',
  lightSide: 'z',
  darkSide: 'z',
};

const colorMap = {
  boostDie: '#72ccdb',
  abilityDie: '#3fac49',
  difficultyDie: '#522480',
  proficiencyDie: '#fff100',
  challengeDie: '#d1232a',
  forceDie: 'white',
  lightSide: 'white',
}

const FontIcon = createIconSet(glyphMap, 'EotESymbol', 'EotESymbol-Regular-PLUS.otf');

export const Icon = ({name, size}) => {
  const color = colorMap[name]
  return <FontIcon
    name={name}
    size={size}
    color={color || colors.primaryText}
    style={color === 'white' ? styles.outline : null}
  />
}

export const IconButton = ({name, size, onPress}) => {
  const color = colorMap[name]
  return <FontIcon.Button
    name={name}
    size={size}
    color={color || colors.primaryText}
    iconStyle={[styles.button, color === 'white' ? styles.outline : null]}
    backgroundColor='transparent'
    onPress={onPress}
  />
}

export const dieSets = {
  boostDie: [
    [],
    [],
    ['success'],
    ['success', 'advantage'],
    ['advantage', 'advantage'],
    ['advantage'],
  ],
  setbackDie: [
    [],
    [],
    ['failure'],
    ['failure'],
    ['threat'],
    ['threat'],
  ],
  abilityDie: [
    [],
    ['success'],
    ['success'],
    ['success', 'success'],
    ['advantage'],
    ['advantage'],
    ['success', 'advantage'],
    ['advantage', 'advantage'],
  ],
  difficultyDie: [
    [],
    ['failure'],
    ['failure', 'failure'],
    ['threat'],
    ['threat'],
    ['threat'],
    ['threat', 'threat'],
    ['failure', 'threat'],
  ],
  proficiencyDie: [
    [],
    ['success'],
    ['success'],
    ['success', 'success'],
    ['success', 'success'],
    ['advantage'],
    ['success', 'advantage'],
    ['success', 'advantage'],
    ['success', 'advantage'],
    ['advantage', 'advantage'],
    ['advantage', 'advantage'],
    ['triumph'],
  ],
  challengeDie: [
    [],
    ['failure'],
    ['failure'],
    ['failure', 'failure'],
    ['failure', 'failure'],
    ['threat'],
    ['threat'],
    ['failure', 'threat'],
    ['failure', 'threat'],
    ['failure', 'failure'],
    ['failure', 'failure'],
    ['despair'],
  ],
  forceDie: [
    ['darkSide'],
    ['darkSide'],
    ['darkSide'],
    ['darkSide'],
    ['darkSide'],
    ['darkSide'],
    ['darkSide', 'darkSide'],
    ['lightSide'],
    ['lightSide'],
    ['lightSide', 'lightSide'],
    ['lightSide', 'lightSide'],
    ['lightSide', 'lightSide'],
  ]
}

export class StarWarsDicePool extends React.PureComponent {
  constructor (props) {
    super(props)

    this.state = {
      pool: [],
      result: [],
    }
  }

  render () {
    return <View style={styles.pool}>
      <View style={styles.container}>
        <H2>Star Wars Dice Pool</H2>
        <B>Add</B>
        {this.renderDieButtons(Object.keys(dieSets), this._add)}
        <B>Pool</B>
        {this.renderDieButtons(this.state.pool, this._remove)}
      </View>

      <Touchable onPress={this.roll}>
        <View style={styles.result}>
          <MCIcon name='dice-multiple' color={colors.textPrimary} size={32} />
          { this.renderDice(this.state.result) }
        </View>
      </Touchable>
    </View>
  }

  renderDieButtons (dice, f) {
    return <View style={styles.row}>
      {dice.map((die, i) => <IconButton
        key={i}
        name={die}
        size={28}
        onPress={() => f(die, i)}
      />)}
    </View>
  }

  @autobind
  _add (die) {
    this.setState({
      pool: this.state.pool.concat([die]),
    })
  }

  @autobind
  _remove (die, i) {
    const arr = [...this.state.pool]
    arr.splice(i, 1)
    this.setState({
      pool: arr,
    })
  }

  renderDice (dice) {
    return dice.map((die, i) => <Icon key={i} name={die} size={24} />)
  }

  @autobind
  roll () {
    let result = []
    this.state.pool.forEach((die) => {
      const set = dieSets[die]
      const roll = set[Math.floor(Math.random() * set.length)]
      result = result.concat(roll)
    })
    this.setState({result})
  }
}

const styles = StyleSheet.create({
  die: {
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  outline: {
    textShadowColor: 'black',
    textShadowRadius: 2,
  },
  result: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    backgroundColor: colors.accent,
    margin: -10,
    marginTop: 10,
    padding: 10
  },
  button: {
    marginRight: 0
  },
  container: {
    marginHorizontal: 10,
  },
  pool: {
    marginVertical: 10,
  }
})
