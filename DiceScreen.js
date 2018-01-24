import React from 'react'
import { StyleSheet, Text, View, TouchableNativeFeedback, ScrollView, Button } from 'react-native'
import {getUser, onLogin, setCharacter, characterID} from './auth'
import {colors, BaseText, B} from './styles.js'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import Roll from 'roll'

export class DiceScreen extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      dice: [
        {
          name: 'D20',
          pattern: '1d20, 1d20+5'
        }
      ]
    }
  }

  render () {
    return <ScrollView style={styles.menu}>
      <BaseText>DiceMenu</BaseText>
      {
        this.state.dice.map((die, i) =>
          <View key={i} style={styles.item}>
            <B>{die.name}</B>
            <View style={styles.row}>
              <BaseText>{die.pattern}</BaseText>
              <Icon.Button
                name="dice-multiple"
                color={colors.secondaryText}
                iconStyle={{marginRight: 0}}
                backgroundColor="transparent"
                onPress={() => this._roll(die, i)}
              />
            </View>
            <BaseText>{die.result}</BaseText>
          </View>
        )
      }
    </ScrollView>
  }

  _roll (die, i) {
    const roll = new Roll()
    const result = die.pattern.split(',').map(
      pattern => roll.roll(pattern.trim()).result
    ).join(', ')
    this.setState(prev => {
      const dice = []
      prev.dice.forEach((die, j) => {
        if (i === j) {
          die.result = result
        }
        dice.push(die)
      })
      return {dice}
    })
  }
}

const styles = StyleSheet.create({
  menu: {
    backgroundColor: 'white',
    flex: 1
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border
  }
})
