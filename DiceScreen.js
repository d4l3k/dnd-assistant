import React from 'react'
import {Alert, Text, StyleSheet, View, ScrollView, Button} from 'react-native'
import {getCharacter} from './auth'
import {colors, BaseText, B, LightBox, H1, Error, showLightBox, Touchable, TextInput} from './styles.js'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Roll from 'roll'

export class DiceScreen extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      dice: []
    }
  }

  componentDidMount () {
    getCharacter().then(character => {
      this.dice = character.collection('dice')
      this.unsubscribe = this.dice.onSnapshot(snapshot => {
        this.setState(state => {
          const dice = []
          snapshot.forEach((data, i) => {
            const die = data.data()
            die.id = data.id
            die.result = (state.dice[i] || {}).result
            dice.push(die)
          })
          dice.sort((a, b) => {
            return a.name < b.name ? -1 : 1
          })
          return {dice}
        })
      })
    })
  }

  componentWillUnmount () {
    if (this.unsubscribe) {
      this.unsubscribe()
      this.unsubscribe = null
    }
  }

  _deleteDie (die) {
    Alert.alert(
      'Remove Gear',
      die.name,
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Remove',
          onPress: () => {
            this.dice.doc(die.id).delete()
          },
          style: 'destructive'
        }
      ]
    )
  }

  render () {
    return <ScrollView style={styles.menu}>
      <View style={styles.header}>
        <H1>Dice</H1>
      </View>
      {
        this.state.dice.map((die, i) =>
          <View key={i} style={styles.item}>
            <View style={styles.row}>
              <View>
                <B>{die.name}</B>
                <BaseText>{die.pattern}</BaseText>
              </View>
              <Ionicons.Button
                name="md-trash"
                color={colors.secondaryText}
                iconStyle={{marginRight: 0}}
                backgroundColor="transparent"
                onPress={() => this._deleteDie(die)}
              />
            </View>


            <Touchable onPress={() => this._roll(die, i)}>
              <View style={styles.result}>
                <Icon name='dice-multiple' color={colors.textPrimary} size={32} />
                { die.result ? <Text style={styles.resultText}>{die.result}</Text> : null }
              </View>
            </Touchable>
          </View>
        )
      }

      <Button
        title='New'
        onPress={() => this.newDie()}
      />
    </ScrollView>
  }

  newDie () {
    showLightBox(this.props.navigator, 'dnd.AddDieScreen')
  }

  _roll (die, i) {
    this.setState(prev => {
      const dice = []
      prev.dice.forEach((die, j) => {
        const result = rollPattern(die.pattern)
        if (i === j) {
          die.result = result
        }
        dice.push(die)
      })
      return {dice}
    })
  }
}

function rollPattern(pattern) {
  const roll = new Roll()
  return pattern.split(',').map(
    pattern => roll.roll(pattern.trim()).result
  ).join(', ')
}

export class AddDieScreen extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      name: '',
      pattern: '',
      error: ''
    }
  }

  render () {
    return <LightBox title='Add Die' navigator={this.props.navigator}>
      <BaseText>Name</BaseText>
      <TextInput
        value={this.state.text}
        onChangeText={text => this._set('name', text)}
      />
      <BaseText>Pattern</BaseText>
      <TextInput
        value={this.state.text}
        onChangeText={text => this._set('pattern', text)}
      />

      <Error error={this.state.error} />

      <Button
        title={'Add'}
        disabled={!!this.state.error}
        onPress={() => this._add()}
      />
    </LightBox>
  }

  _set (key, text) {
    this.setState(prev => {
      const state = {}
      state[key] = text
      return state
    })

    let error = ''
    if (key === 'pattern') {
      try {
        rollPattern(text)
      } catch (e) {
        error = e.toString()
      }
    }
    this.setState(prev => {
      return {error}
    })
  }

  _add () {
    if (!this.state.name || !this.state.pattern) {
      this.setState(prev => {
        return {error: 'All fields are required'}
      })
      return
    }
    getCharacter().then(character => {
      return character.collection('dice').add({
        name: this.state.name,
        pattern: this.state.pattern
      })
    }).then(() => {
      this.props.navigator.dismissLightBox()
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
  },
  result: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: colors.accent,
    margin: -10,
    marginTop: 10,
    padding: 10
  },
  resultText: {
    color: colors.textPrimary,
    textAlign: 'center',
    fontSize: 24,
    marginLeft: 10
  },
  header: {
    padding: 10,
    borderBottomColor: colors.border,
    borderBottomWidth: 1
  }
})
